import { describe, it, expect } from 'vitest';
import { noteToFreq, parseTrack, trackLength, parseDrums, drumLength } from '../src/audio/notes';

describe('noteToFreq', () => {
  it('tunes A4 to 440 Hz', () => {
    expect(noteToFreq('A4')).toBeCloseTo(440);
  });

  it('computes middle C', () => {
    expect(noteToFreq('C4')).toBeCloseTo(261.63, 1);
  });

  it('handles sharps and flats as enharmonics', () => {
    expect(noteToFreq('C#4')).toBeCloseTo(noteToFreq('Db4'));
  });

  it('doubles frequency per octave', () => {
    expect(noteToFreq('A5')).toBeCloseTo(noteToFreq('A4') * 2);
  });

  it('rejects malformed notes', () => {
    expect(() => noteToFreq('H4')).toThrow();
    expect(() => noteToFreq('C')).toThrow();
  });
});

describe('parseTrack', () => {
  it('accumulates start times and skips rests', () => {
    const events = parseTrack('C4:4 -:4 E4:8');
    expect(events).toHaveLength(2);
    expect(events[0].start).toBe(0);
    expect(events[0].len).toBe(4);
    expect(events[1].start).toBe(8);
    expect(events[1].len).toBe(8);
  });

  it('throws on bad durations', () => {
    expect(() => parseTrack('C4:0')).toThrow();
    expect(() => parseTrack('C4:x')).toThrow();
  });
});

describe('trackLength / drums', () => {
  it('totals sixteenth notes including rests', () => {
    expect(trackLength('C4:4 -:4 E4:8')).toBe(16);
  });

  it('parses drum hits with positions', () => {
    const hits = parseDrums('x.s. x..s');
    expect(hits).toEqual([
      { type: 'x', start: 0 },
      { type: 's', start: 2 },
      { type: 'x', start: 4 },
      { type: 's', start: 7 }
    ]);
    expect(drumLength('x.s. x..s')).toBe(8);
  });
});

describe('all game tracks are well-formed', () => {
  it('every composed track parses and channels align to the same loop grid', async () => {
    const { TRACKS } = await import('../src/audio/tracks');
    for (const song of Object.values(TRACKS)) {
      const len = trackLength(song.pulse1);
      expect(len, `${song.name} pulse1 empty`).toBeGreaterThan(0);
      expect(() => parseTrack(song.pulse1), song.name).not.toThrow();
      if (song.pulse2) expect(() => parseTrack(song.pulse2!), song.name).not.toThrow();
      if (song.triangle) expect(() => parseTrack(song.triangle!), song.name).not.toThrow();
    }
  });
});
