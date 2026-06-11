/**
 * Pure music-theory helpers for the chiptune engine.
 * Kept free of WebAudio so they can be unit tested in Node.
 *
 * Track notation: space-separated tokens, each `NOTE:LEN` where NOTE is like
 * C4, F#3, Eb5 or '-' for a rest, and LEN is a duration in sixteenth notes.
 * Example: "C4:4 E4:4 G4:8 -:8"
 */

const SEMITONES: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
};

/** Convert a note name (e.g. "A4") to frequency in Hz. A4 = 440. */
export function noteToFreq(note: string): number {
  const m = /^([A-G][b#]?)(-?\d)$/.exec(note);
  if (!m) throw new Error(`Bad note: ${note}`);
  const semis = SEMITONES[m[1]];
  const octave = parseInt(m[2], 10);
  const midi = (octave + 1) * 12 + semis;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export interface NoteEvent {
  /** Frequency in Hz, or 0 for a rest. */
  freq: number;
  /** Start time in sixteenth notes from track start. */
  start: number;
  /** Duration in sixteenth notes. */
  len: number;
}

/** Parse a track string into note events. Throws on malformed tokens. */
export function parseTrack(track: string): NoteEvent[] {
  const events: NoteEvent[] = [];
  let t = 0;
  for (const token of track.trim().split(/\s+/)) {
    if (!token) continue;
    const [note, lenStr] = token.split(':');
    const len = parseInt(lenStr, 10);
    if (!Number.isFinite(len) || len <= 0) throw new Error(`Bad token: ${token}`);
    if (note !== '-') {
      events.push({ freq: noteToFreq(note), start: t, len });
    }
    t += len;
  }
  return events;
}

/** Total length of a track in sixteenth notes. */
export function trackLength(track: string): number {
  let t = 0;
  for (const token of track.trim().split(/\s+/)) {
    if (!token) continue;
    const len = parseInt(token.split(':')[1], 10);
    if (Number.isFinite(len) && len > 0) t += len;
  }
  return t;
}

/**
 * Parse a drum pattern: one char per sixteenth.
 * 'x' = kick (low noise thump), 's' = snare/hat (short noise), '.' = rest.
 */
export function parseDrums(pattern: string): { type: 'x' | 's'; start: number }[] {
  const hits: { type: 'x' | 's'; start: number }[] = [];
  const clean = pattern.replace(/\s+/g, '');
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (c === 'x' || c === 's') hits.push({ type: c, start: i });
  }
  return hits;
}

export function drumLength(pattern: string): number {
  return pattern.replace(/\s+/g, '').length;
}
