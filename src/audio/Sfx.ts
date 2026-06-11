/**
 * Retro sound effects synthesized on the fly with WebAudio envelopes.
 * Each effect is a tiny oscillator/noise gesture in classic NES style.
 */
import { chiptune } from './Chiptune';

type SfxName =
  | 'jump'
  | 'coin'
  | 'stomp'
  | 'kick'
  | 'damage'
  | 'powerup'
  | 'powerdown'
  | 'oneup'
  | 'break'
  | 'bump'
  | 'spark'
  | 'spring'
  | 'pipe'
  | 'gem'
  | 'key'
  | 'door'
  | 'pause'
  | 'select'
  | 'flag'
  | 'splash'
  | 'bosshit';

function env(
  type: OscillatorType,
  f0: number,
  f1: number,
  dur: number,
  vol = 0.25,
  delay = 0
): void {
  const ctx = chiptune.context;
  const out = chiptune.sfxOut;
  if (!ctx || !out) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function blip(freq: number, dur = 0.08, vol = 0.22, delay = 0, type: OscillatorType = 'square'): void {
  env(type, freq, freq, dur, vol, delay);
}

export function playSfx(name: SfxName): void {
  chiptune.ensureContext();
  switch (name) {
    case 'jump':
      env('square', 220, 880, 0.18, 0.18);
      break;
    case 'coin':
      blip(988, 0.06, 0.2);
      blip(1319, 0.18, 0.2, 0.06);
      break;
    case 'gem':
      blip(1319, 0.06, 0.2);
      blip(1760, 0.08, 0.2, 0.06);
      blip(2093, 0.25, 0.2, 0.14);
      break;
    case 'stomp':
      env('square', 400, 80, 0.12, 0.25);
      break;
    case 'kick':
      env('square', 600, 150, 0.1, 0.25);
      break;
    case 'damage':
      env('sawtooth', 400, 60, 0.35, 0.25);
      break;
    case 'powerup':
      for (let i = 0; i < 6; i++) blip(523 * Math.pow(1.122, i), 0.07, 0.18, i * 0.055);
      break;
    case 'powerdown':
      for (let i = 0; i < 5; i++) blip(880 / Math.pow(1.122, i), 0.07, 0.18, i * 0.055);
      break;
    case 'oneup':
      [523, 659, 784, 1047, 1319].forEach((f, i) => blip(f, 0.09, 0.18, i * 0.09));
      break;
    case 'break':
      env('sawtooth', 300, 50, 0.2, 0.3);
      env('square', 150, 40, 0.15, 0.2, 0.02);
      break;
    case 'bump':
      env('square', 140, 70, 0.1, 0.25);
      break;
    case 'spark':
      env('sawtooth', 900, 200, 0.12, 0.18);
      break;
    case 'spring':
      env('square', 200, 1200, 0.22, 0.2);
      break;
    case 'pipe':
      env('square', 500, 100, 0.4, 0.22);
      break;
    case 'key':
      blip(1175, 0.07, 0.2);
      blip(1568, 0.15, 0.2, 0.07);
      break;
    case 'door':
      env('square', 180, 90, 0.25, 0.22);
      break;
    case 'pause':
      blip(880, 0.06, 0.2);
      blip(660, 0.1, 0.2, 0.07);
      break;
    case 'select':
      blip(1047, 0.05, 0.18);
      break;
    case 'flag':
      [392, 523, 659, 784, 1047].forEach((f, i) => blip(f, 0.1, 0.18, i * 0.08));
      break;
    case 'splash':
      env('sawtooth', 600, 100, 0.3, 0.12);
      break;
    case 'bosshit':
      env('square', 250, 40, 0.4, 0.3);
      env('sawtooth', 500, 60, 0.3, 0.2, 0.05);
      break;
  }
}
