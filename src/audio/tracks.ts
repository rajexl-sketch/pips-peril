/**
 * Original chiptune compositions for Pip's Peril.
 * Written in the engine's note notation (NOTE:SIXTEENTHS). Every melody here
 * was composed for this game — energetic, loop-friendly, NES-inspired.
 */
import { Song } from './Chiptune';

export const TRACKS: Record<string, Song> = {
  title: {
    name: 'title',
    bpm: 132,
    pulse1:
      'C5:4 G4:4 A4:4 B4:4 C5:8 E5:8 D5:4 B4:4 G4:4 A4:4 B4:16 ' +
      'C5:4 G4:4 A4:4 B4:4 C5:8 E5:8 G5:4 F5:4 E5:4 D5:4 C5:16',
    pulse2:
      'E4:4 D4:4 E4:4 F4:4 E4:8 G4:8 F4:4 G4:4 D4:4 F4:4 G4:16 ' +
      'E4:4 D4:4 E4:4 F4:4 E4:8 G4:8 B4:4 A4:4 G4:4 F4:4 E4:16',
    triangle:
      'C3:8 G2:8 A2:8 G2:8 C3:8 A2:8 G2:8 G2:8 ' +
      'C3:8 G2:8 A2:8 G2:8 C3:8 A2:8 G2:4 G2:4 C3:8',
    drums: 'x...s...x...s... x...s...x...s... x...s...x...s... x...s...x..ss.s.'
  },

  grass: {
    name: 'grass',
    bpm: 168,
    pulse1:
      'G4:2 C5:2 E5:2 G5:2 E5:2 C5:2 G4:4 ' +
      'A4:2 D5:2 F5:2 A5:2 F5:2 D5:2 A4:4 ' +
      'G4:2 B4:2 D5:2 G5:2 D5:2 B4:2 G4:4 ' +
      'C5:4 E5:2 D5:2 C5:8 ' +
      'E5:2 G5:2 E5:2 C5:2 D5:2 F5:2 D5:2 B4:2 ' +
      'C5:2 E5:2 C5:2 A4:2 B4:2 D5:2 B4:2 G4:2 ' +
      'A4:2 C5:2 E5:2 A5:2 G5:2 F5:2 E5:2 D5:2 ' +
      'C5:8 G4:4 C5:4',
    pulse2:
      '-:2 E4:2 -:2 E4:2 -:2 E4:2 -:2 E4:2 ' +
      '-:2 F4:2 -:2 F4:2 -:2 F4:2 -:2 F4:2 ' +
      '-:2 D4:2 -:2 D4:2 -:2 D4:2 -:2 D4:2 ' +
      '-:2 E4:2 -:2 E4:2 -:2 E4:2 -:2 E4:2 ' +
      '-:2 G4:2 -:2 G4:2 -:2 F4:2 -:2 F4:2 ' +
      '-:2 E4:2 -:2 E4:2 -:2 D4:2 -:2 D4:2 ' +
      '-:2 E4:2 -:2 E4:2 -:2 F4:2 -:2 F4:2 ' +
      '-:2 E4:2 -:2 D4:2 -:2 E4:2 -:2 E4:2',
    triangle:
      'C3:4 G2:4 C3:4 G2:4 F3:4 C3:4 F3:4 C3:4 ' +
      'G3:4 D3:4 G3:4 D3:4 C3:4 G2:4 C3:8 ' +
      'C3:4 G2:4 C3:4 G2:4 A2:4 E3:4 A2:4 E3:4 ' +
      'F3:4 C3:4 G3:4 G2:4 C3:4 G2:4 C3:8',
    drums:
      'x.s.x.s.x.s.x.ss x.s.x.s.x.s.x.s. x.s.x.s.x.s.x.ss x.s.x.s.x.s.x.s. ' +
      'x.s.x.s.x.s.x.ss x.s.x.s.x.s.x.s. x.s.x.s.x.s.x.ss x.s.x.s.x.ssx.ss'
  },

  cave: {
    name: 'cave',
    bpm: 124,
    pulse1:
      'A3:4 C4:4 E4:4 D4:4 C4:8 B3:8 ' +
      'A3:4 C4:4 E4:4 G4:4 A4:16 ' +
      'G4:4 E4:4 F4:4 D4:4 E4:8 C4:8 ' +
      'B3:4 D4:4 E4:4 G#3:4 A3:16',
    pulse2:
      '-:8 A4:2 -:6 -:8 E4:2 -:6 ' +
      '-:8 C5:2 -:6 -:8 E5:2 -:6 ' +
      '-:8 G4:2 -:6 -:8 C4:2 -:6 ' +
      '-:8 D4:2 -:6 -:8 E4:2 -:6',
    triangle:
      'A2:8 E2:8 A2:8 E2:8 A2:8 E2:8 F2:8 G2:8 ' +
      'C3:8 G2:8 F2:8 G2:8 E2:8 E2:8 A2:16',
    drums: 'x.......s....... x.......s....... x.......s....... x.......s..s....'
  },

  sky: {
    name: 'sky',
    bpm: 152,
    pulse1:
      'C5:2 E5:2 G5:2 E5:2 C5:2 E5:2 G5:2 E5:2 ' +
      'D5:2 F5:2 A5:2 F5:2 D5:2 F5:2 A5:2 F5:2 ' +
      'B4:2 D5:2 G5:2 D5:2 B4:2 D5:2 G5:2 D5:2 ' +
      'C5:2 E5:2 G5:2 C6:2 G5:4 E5:4 ' +
      'A4:2 C5:2 F5:2 C5:2 A4:2 C5:2 F5:2 C5:2 ' +
      'G4:2 C5:2 E5:2 C5:2 G4:2 C5:2 E5:2 C5:2 ' +
      'D5:2 F5:2 B5:2 F5:2 D5:4 B4:4 ' +
      'C5:12 -:4',
    triangle:
      'C3:8 C3:8 F3:8 F3:8 G2:8 G2:8 C3:8 C3:8 ' +
      'F3:8 F3:8 C3:8 C3:8 G2:8 G2:8 C3:16',
    drums: '..s...s...s...s. ..s...s...s...s. ..s...s...s...s. ..s...s...s...s.'
  },

  night: {
    name: 'night',
    bpm: 112,
    pulse1:
      'E4:8 G4:4 A4:4 B4:8 A4:4 G4:4 ' +
      'E4:8 G4:4 B4:4 A4:16 ' +
      'C5:8 B4:4 A4:4 G4:8 E4:4 G4:4 ' +
      'A4:8 G4:4 F#4:4 E4:16',
    pulse2:
      '-:4 B3:4 -:4 B3:4 -:4 B3:4 -:4 B3:4 ' +
      '-:4 C4:4 -:4 C4:4 -:4 C4:4 -:4 C4:4 ' +
      '-:4 A3:4 -:4 A3:4 -:4 B3:4 -:4 B3:4 ' +
      '-:4 C4:4 -:4 A3:4 -:4 B3:4 -:4 B3:4',
    triangle:
      'E2:16 A2:16 C3:16 E2:16 A2:16 G2:16 D3:16 E2:16',
    drums: 'x.......x....... x.......x....... x.......x....... x.......x.....s.'
  },

  water: {
    name: 'water',
    bpm: 140,
    pulse1:
      'C5:4 E5:2 G5:6 E5:4 ' +
      'D5:4 F5:2 A5:6 F5:4 ' +
      'B4:4 D5:2 G5:6 D5:4 ' +
      'C5:4 E5:2 C5:6 G4:4 ' +
      'A4:4 C5:2 F5:6 C5:4 ' +
      'G4:4 B4:2 E5:6 B4:4 ' +
      'A4:4 B4:2 D5:6 B4:4 ' +
      'C5:12 -:4',
    triangle:
      'C3:4 G3:4 G3:8 F3:4 C4:4 C4:8 G2:4 G3:4 G3:8 C3:4 G3:4 G3:8 ' +
      'F3:4 C4:4 C4:8 C3:4 G3:4 G3:8 G2:4 D3:4 D3:8 C3:16',
    drums: '................'
  },

  fortress: {
    name: 'fortress',
    bpm: 150,
    pulse1:
      'A3:2 A3:2 C4:2 A3:2 Eb4:2 A3:2 D4:2 C4:2 ' +
      'A3:2 A3:2 C4:2 A3:2 E4:2 D4:2 C4:2 B3:2 ' +
      'F3:2 F3:2 Ab3:2 F3:2 C4:2 F3:2 B3:2 Ab3:2 ' +
      'E3:2 E3:2 G#3:2 E3:2 B3:2 G#3:2 E4:4 ' +
      'A3:2 A3:2 C4:2 A3:2 Eb4:2 A3:2 D4:2 C4:2 ' +
      'A3:2 A3:2 C4:2 A3:2 E4:2 D4:2 C4:2 B3:2 ' +
      'F3:2 Ab3:2 C4:2 F4:2 E4:2 C4:2 B3:2 G#3:2 ' +
      'A3:4 E3:4 A3:8',
    pulse2:
      '-:4 E4:4 -:4 E4:4 -:4 E4:4 -:4 E4:4 ' +
      '-:4 F4:4 -:4 F4:4 -:4 E4:4 -:4 B3:4 ' +
      '-:4 E4:4 -:4 E4:4 -:4 E4:4 -:4 E4:4 ' +
      '-:4 F4:4 -:4 D4:4 -:4 E4:4 A4:8',
    triangle:
      'A2:4 A2:4 A2:4 G2:4 A2:4 A2:4 F2:4 E2:4 ' +
      'F2:4 F2:4 F2:4 F2:4 E2:4 E2:4 E2:8 ' +
      'A2:4 A2:4 A2:4 G2:4 A2:4 A2:4 F2:4 E2:4 ' +
      'F2:4 F2:4 E2:4 E2:4 A2:4 E2:4 A2:8',
    drums:
      'x..x..x.x..x..s. x..x..x.x..x..s. x..x..x.x..x..s. x..x..x.x.ss..ss ' +
      'x..x..x.x..x..s. x..x..x.x..x..s. x..x..x.x..x..s. x.x.x.x.ssssssss'
  },

  lava: {
    name: 'lava',
    bpm: 176,
    pulse1:
      'D4:2 D4:2 F4:2 D4:2 Ab4:2 G4:2 F4:2 D4:2 ' +
      'D4:2 D4:2 F4:2 D4:2 A4:2 Ab4:2 G4:2 F4:2 ' +
      'Bb3:2 Bb3:2 D4:2 Bb3:2 F4:2 E4:2 D4:2 C4:2 ' +
      'A3:2 C4:2 E4:2 A4:2 G4:2 E4:2 C#4:2 A3:2',
    pulse2:
      '-:2 A4:2 -:2 A4:2 -:2 A4:2 -:2 A4:2 ' +
      '-:2 Bb4:2 -:2 Bb4:2 -:2 A4:2 -:2 A4:2 ' +
      '-:2 F4:2 -:2 F4:2 -:2 G4:2 -:2 G4:2 ' +
      '-:2 E4:2 -:2 E4:2 -:2 A4:2 -:2 A4:2',
    triangle:
      'D2:4 D2:4 D2:4 C2:4 D2:4 D2:4 D2:4 F2:4 ' +
      'Bb2:4 Bb2:4 Bb2:4 A2:4 A2:4 A2:4 A2:4 A2:4',
    drums: 'x.x.s.x.x.x.s.x. x.x.s.x.x.x.s.x. x.x.s.x.x.x.s.x. x.x.s.x.s.s.s.s.'
  },

  boss: {
    name: 'boss',
    bpm: 180,
    pulse1:
      'E4:2 E4:2 G4:2 E4:2 Bb4:2 A4:2 G4:2 E4:2 ' +
      'E4:2 G4:2 A4:2 Bb4:2 B4:2 Bb4:2 A4:2 G4:2 ' +
      'C4:2 C4:2 Eb4:2 C4:2 G4:2 F#4:2 Eb4:2 C4:2 ' +
      'B3:2 D4:2 F#4:2 B4:2 A4:2 F#4:2 D4:2 B3:2',
    pulse2:
      'E3:2 E3:2 E3:2 E3:2 E3:2 E3:2 E3:2 E3:2 ' +
      'E3:2 E3:2 E3:2 E3:2 E3:2 E3:2 E3:2 E3:2 ' +
      'C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 ' +
      'B2:2 B2:2 B2:2 B2:2 B2:2 B2:2 B2:2 B2:2',
    triangle:
      'E2:8 E2:4 D2:4 E2:8 G2:4 A2:4 C2:8 C2:4 D2:4 B1:8 B1:4 B1:4',
    drums: 'x.x.s.x.x.x.s.s. x.x.s.x.x.x.s.s. x.x.s.x.x.x.s.s. x.s.x.s.xsxsxsxs'
  },

  victory: {
    name: 'victory',
    bpm: 140,
    pulse1: 'C5:2 E5:2 G5:2 C6:6 G5:2 A5:2 G5:2 E5:2 C5:2 D5:4 C5:12',
    pulse2: 'E4:2 G4:2 C5:2 E5:6 C5:2 F5:2 E5:2 C5:2 G4:2 B4:4 E5:12',
    triangle: 'C3:8 G2:8 F2:8 G2:4 G2:4 C3:8',
    drums: 'x...x...x...x.s. x.....s.........'
  },

  clear: {
    name: 'clear',
    bpm: 150,
    pulse1: 'G4:2 C5:2 E5:2 G5:4 E5:2 G5:8 -:4',
    pulse2: 'E4:2 G4:2 C5:2 E5:4 C5:2 E5:8 -:4',
    triangle: 'C3:4 G2:4 C3:8 C3:4 -:4',
    drums: 'x.......x.s.....'
  },

  death: {
    name: 'death',
    bpm: 120,
    pulse1: 'B4:2 Bb4:2 A4:2 Ab4:6 -:2 E4:2 Ab3:2 C4:2 E3:2 A3:8 -:4',
    triangle: 'E2:8 E2:4 A1:12 -:8',
    drums: 'x...........x...'
  },

  hurry: {
    name: 'hurry',
    bpm: 200,
    pulse1: 'A4:2 A4:2 A4:2 -:2 A4:2 B4:2 C5:2 -:2',
    triangle: 'A2:4 A2:4 A2:4 A2:4',
    drums: 'x.x.x.x.'
  }
};

/** Map a world theme to its background music track. */
export const THEME_MUSIC: Record<string, Song> = {
  grass: TRACKS.grass,
  cave: TRACKS.cave,
  sky: TRACKS.sky,
  night: TRACKS.night,
  water: TRACKS.water,
  fortress: TRACKS.fortress,
  lava: TRACKS.lava
};
