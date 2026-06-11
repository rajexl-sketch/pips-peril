/**
 * NES-style chiptune synthesizer built on the WebAudio API.
 *
 * Emulates the classic 2A03 channel layout:
 *   - 2 pulse (square) channels  -> melody + harmony
 *   - 1 triangle channel         -> bass
 *   - 1 noise channel            -> drums
 *
 * Music is scheduled with a look-ahead timer so playback stays sample-
 * accurate even if the main thread hiccups. SFX are fire-and-forget
 * oscillator envelopes (see Sfx.ts).
 */
import { NoteEvent, parseTrack, parseDrums, trackLength, drumLength } from './notes';

export interface Song {
  name: string;
  bpm: number;
  pulse1: string;
  pulse2?: string;
  triangle?: string;
  drums?: string;
}

interface ParsedSong {
  song: Song;
  pulse1: NoteEvent[];
  pulse2: NoteEvent[];
  triangle: NoteEvent[];
  drums: { type: 'x' | 's'; start: number }[];
  length16ths: number;
}

const LOOKAHEAD_S = 0.15;
const TICK_MS = 40;

export class Chiptune {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private noiseBuffer!: AudioBuffer;

  private current: ParsedSong | null = null;
  private songStart = 0; // ctx time when the current loop iteration began
  private nextEventIdx = { p1: 0, p2: 0, tri: 0, dr: 0 };
  private timer: ReturnType<typeof setInterval> | null = null;
  private scheduled: { node: AudioScheduledSourceNode; gain: GainNode }[] = [];

  musicVolume = 0.6;
  sfxVolume = 0.8;

  /** Lazily create the AudioContext (must be after a user gesture). */
  ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.musicVolume;
      this.musicBus.connect(this.master);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = this.sfxVolume;
      this.sfxBus.connect(this.master);
      // 1 second of white noise, reused by all drum/noise hits
      const len = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  setMusicVolume(v: number): void {
    this.musicVolume = v;
    if (this.ctx) this.musicBus.gain.value = v;
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = v;
    if (this.ctx) this.sfxBus.gain.value = v;
  }

  get sfxOut(): GainNode | null {
    return this.ctx ? this.sfxBus : null;
  }

  get context(): AudioContext | null {
    return this.ctx;
  }

  // ------------------------------------------------------------------ music

  play(song: Song): void {
    if (this.current?.song.name === song.name) return;
    const ctx = this.ensureContext();
    this.stop();
    const pulse1 = parseTrack(song.pulse1);
    const pulse2 = song.pulse2 ? parseTrack(song.pulse2) : [];
    const triangle = song.triangle ? parseTrack(song.triangle) : [];
    const drums = song.drums ? parseDrums(song.drums) : [];
    const length16ths = Math.max(
      trackLength(song.pulse1),
      song.pulse2 ? trackLength(song.pulse2) : 0,
      song.triangle ? trackLength(song.triangle) : 0,
      song.drums ? drumLength(song.drums) : 0
    );
    this.current = { song, pulse1, pulse2, triangle, drums, length16ths };
    this.songStart = ctx.currentTime + 0.05;
    this.nextEventIdx = { p1: 0, p2: 0, tri: 0, dr: 0 };
    this.timer = setInterval(() => this.schedule(), TICK_MS);
    this.schedule();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    for (const s of this.scheduled) {
      try {
        s.gain.gain.cancelScheduledValues(0);
        s.gain.gain.value = 0;
        s.node.stop();
      } catch {
        /* already stopped */
      }
    }
    this.scheduled = [];
    this.current = null;
  }

  get playing(): string | null {
    return this.current?.song.name ?? null;
  }

  /** Seconds per sixteenth note at the current song's tempo. */
  private step16(): number {
    return 60 / (this.current!.song.bpm * 4);
  }

  private schedule(): void {
    const ctx = this.ctx;
    const cur = this.current;
    if (!ctx || !cur) return;
    const until = ctx.currentTime + LOOKAHEAD_S;
    const step = this.step16();
    const loopDur = cur.length16ths * step;

    // Advance to the next loop iteration when the current one is exhausted.
    while (true) {
      this.scheduleChannel(cur.pulse1, 'p1', 'square', 0.16, until, step);
      this.scheduleChannel(cur.pulse2, 'p2', 'square', 0.1, until, step);
      this.scheduleChannel(cur.triangle, 'tri', 'triangle', 0.22, until, step);
      this.scheduleDrums(until, step);
      const loopEnd = this.songStart + loopDur;
      const exhausted =
        this.nextEventIdx.p1 >= cur.pulse1.length &&
        this.nextEventIdx.p2 >= cur.pulse2.length &&
        this.nextEventIdx.tri >= cur.triangle.length &&
        this.nextEventIdx.dr >= cur.drums.length;
      if (exhausted && loopEnd < until) {
        this.songStart = loopEnd;
        this.nextEventIdx = { p1: 0, p2: 0, tri: 0, dr: 0 };
        continue; // schedule the start of the next loop in the same pass
      }
      break;
    }

    // Garbage-collect finished source bookkeeping.
    if (this.scheduled.length > 128) this.scheduled.splice(0, 64);
  }

  private scheduleChannel(
    events: NoteEvent[],
    idxKey: 'p1' | 'p2' | 'tri',
    type: OscillatorType,
    vol: number,
    until: number,
    step: number
  ): void {
    const ctx = this.ctx!;
    while (this.nextEventIdx[idxKey] < events.length) {
      const ev = events[this.nextEventIdx[idxKey]];
      const t = this.songStart + ev.start * step;
      if (t > until) break;
      this.nextEventIdx[idxKey]++;
      if (t < ctx.currentTime - 0.02) continue; // too late, skip
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = ev.freq;
      const gain = ctx.createGain();
      const dur = ev.len * step;
      const attack = 0.005;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + attack);
      gain.gain.setValueAtTime(vol, t + dur * 0.7);
      gain.gain.linearRampToValueAtTime(0, t + dur * 0.95);
      osc.connect(gain).connect(this.musicBus);
      osc.start(t);
      osc.stop(t + dur);
      this.scheduled.push({ node: osc, gain });
    }
  }

  private scheduleDrums(until: number, step: number): void {
    const ctx = this.ctx!;
    const cur = this.current!;
    while (this.nextEventIdx.dr < cur.drums.length) {
      const hit = cur.drums[this.nextEventIdx.dr];
      const t = this.songStart + hit.start * step;
      if (t > until) break;
      this.nextEventIdx.dr++;
      if (t < ctx.currentTime - 0.02) continue;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      if (hit.type === 'x') {
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        src.start(t, 0, 0.1);
      } else {
        filter.type = 'highpass';
        filter.frequency.value = 4000;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        src.start(t, 0, 0.05);
      }
      src.connect(filter).connect(gain).connect(this.musicBus);
      this.scheduled.push({ node: src, gain });
    }
  }
}

/** Singleton audio engine shared by all scenes. */
export const chiptune = new Chiptune();
