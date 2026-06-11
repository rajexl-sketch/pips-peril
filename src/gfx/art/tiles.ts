/**
 * Tile and item art. Terrain tiles use a generic palette whose entries are
 * overridden per world theme (grass / cave / sky / night / water / fortress /
 * lava) so one grid yields seven looks — the classic NES palette-swap trick.
 */
import { Palette } from '../render';

/** Base terrain palette; themes override t (top), f (fill), s (shade). */
export const TERRAIN_PALETTE: Palette = {
  t: '#48b048', // surface
  f: '#a06030', // fill
  s: '#683818', // shade / speckle
  k: '#101010'
};

export const THEME_TERRAIN: Record<string, Palette> = {
  grass: { t: '#48b048', f: '#a06030', s: '#683818', k: '#101010' },
  cave: { t: '#8888a8', f: '#585878', s: '#383850', k: '#080810' },
  sky: { t: '#f0f0f8', f: '#b8c8e8', s: '#8898c8', k: '#404060' },
  night: { t: '#3878c0', f: '#284878', s: '#182848', k: '#080818' },
  water: { t: '#40c0a0', f: '#287858', s: '#184838', k: '#081810' },
  fortress: { t: '#a0a0a0', f: '#686868', s: '#404040', k: '#101010' },
  lava: { t: '#c05030', f: '#702818', s: '#481008', k: '#180800' }
};

export const GROUND = [
  'tttttttttttttttt',
  'tttttttttttttttt',
  'sffffffsffffffsf',
  'ffffffffffffffff',
  'ffsfffffffffsfff',
  'ffffffffffffffff',
  'fffffffsffffffff',
  'fsffffffffffffsf',
  'ffffffffffffffff',
  'ffffsfffffffffff',
  'ffffffffffsfffff',
  'fsffffffffffffff',
  'ffffffffffffffff',
  'ffffffsffffffffs',
  'fffsffffffffffff',
  'ffffffffffffffff'
];

export const BRICK = [
  'kkkkkkkkkkkkkkkk',
  'kffffffftFffffff',
  'kfFFFFFFtFFFFFFF',
  'kfFFFFFFtFFFFFFF',
  'kfFFFFFFtFFFFFFF',
  'kfFFFFFFtFFFFFFF',
  'kfFFFFFFtFFFFFFF',
  'kttttttttttttttt',
  'kFffftFFFFFFfftF',
  'kFFFFtFFFFFFFFtF',
  'kFFFFtFFFFFFFFtF',
  'kFFFFtFFFFFFFFtF',
  'kFFFFtFFFFFFFFtF',
  'kFFFFtFFFFFFFFtF',
  'kttttttttttttttt',
  'kkkkkkkkkkkkkkkk'
];

export const BRICK_PALETTE: Palette = {
  k: '#181008',
  f: '#d88848',
  F: '#c87038',
  t: '#683818'
};

export const SOLID_BLOCK = [
  'wwwwwwwwwwwwwwwk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffwffffffffwffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'wffwffffffffwffk',
  'wffffffffffffffk',
  'wffffffffffffffk',
  'kkkkkkkkkkkkkkkk'
];

export const SOLID_PALETTE: Palette = {
  k: '#202020',
  f: '#b08858',
  w: '#e8c898'
};

export const QUESTION0 = [
  'kkkkkkkkkkkkkkkk',
  'kwffffffffffffwk',
  'kffffffffffffffk',
  'kfffkkkkkkffffk.',
  'kffkkffffkkfffsk',
  'kffkkffffkkfffsk',
  'kffffffkkkffffsk',
  'kfffffkkffffffsk',
  'kfffffkkffffffsk',
  'kfffffkkffffffsk',
  'kfffffffffffffsk',
  'kfffffkkffffffsk',
  'kfffffkkffffffsk',
  'kfffffffffffffsk',
  'kwffsssssssssswk',
  'kkkkkkkkkkkkkkkk'
];

export const QUESTION_PALETTE: Palette = {
  k: '#181008',
  f: '#e8a020',
  w: '#f8e0a0',
  s: '#a86010'
};

export const QUESTION_USED = [
  'kkkkkkkkkkkkkkkk',
  'kffffffffffffffk',
  'kfssssssssssssfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kfsffffffffffsfk',
  'kffffffffffffffk',
  'kkkkkkkkkkkkkkkk'
];

export const USED_PALETTE: Palette = {
  k: '#181008',
  f: '#906840',
  s: '#684828'
};

// Warp pipe (drawn as a riveted teal tube — original style)
export const PIPE_PALETTE: Palette = {
  k: '#082818',
  p: '#28a060',
  l: '#70d8a0',
  d: '#186040'
};

export const PIPE_TL = [
  'kkkkkkkkkkkkkkkk',
  'klpppppppppppppp',
  'klpppppppppppppp',
  'klpplpplpplpplpp',
  'klpppppppppppppp',
  'kdddddddddddddddd'.slice(0, 16),
  'kkkkkkkkkkkkkkkk',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..klpplpplpplppl',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..kdppppppppdppp',
  '..kdpppppppppppp',
  '..kddddddddddddd'
];

export const PIPE_TR = [
  'kkkkkkkkkkkkkkkk',
  'ppppppppppppppdk',
  'ppppppppppppppdk',
  'plpplpplpplppldk',
  'ppppppppppppppdk',
  'dddddddddddddddk',
  'kkkkkkkkkkkkkkkk',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'pplpplpplppldk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'ppppdppppppddk..',
  'ppppppppppppdk..',
  'dddddddddddddk..'
];

export const PIPE_BL = [
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..klpplpplpplppl',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..kdppppppppdppp',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..klpplpplpplppl',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..klpppppppppppp',
  '..kdppppppppdppp',
  '..klpppppppppppp',
  '..klpppppppppppp'
];

export const PIPE_BR = [
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'pplpplpplppldk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'ppppdppppppddk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'pplpplpplppldk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..',
  'ppppdppppppddk..',
  'ppppppppppppdk..',
  'ppppppppppppdk..'
];

// One-way wooden platform — 16x16 (solid only on top half visually)
export const PLATFORM = [
  'wwwwwwwwwwwwwwww',
  'ffffffffffffffff',
  'fsffsffsffsffsff',
  'ssssssssssssssss',
  '.k....k....k....',
  '.k....k....k....',
  '.k....k....k....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................'
];

export const PLATFORM_PALETTE: Palette = {
  w: '#e8c080',
  f: '#b07840',
  s: '#785020',
  k: '#785020'
};

// Moving platform — 32x8
export const MPLATFORM = [
  'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  'ffffffffffffffffffffffffffffffff',
  'fsfsfsfsfsfsfsfsfsfsfsfsfsfsfsfs',
  'ffffffffffffffffffffffffffffffff',
  'ssssssssssssssssssssssssssssssss',
  '.k..........k..........k.......',
  '.k..........k..........k.......',
  '................................'
].map((r) => r.padEnd(32, '.'));

// Falling platform — 16x8, visibly cracked
export const FPLATFORM = [
  'wwwwwwk.wwwwwwww',
  'ffffffkffff.kfff',
  'fsfsfskfsf.kfsfs',
  'ffff.kffffkfffff',
  'ssssskssss.kssss',
  '.k.....k....k...',
  '.k.....k....k...',
  '................'
];

export const SPIKE = [
  '................',
  '.......k........',
  '......kvk.......',
  '......kvk..k....',
  '..k..kvvvk.kk...',
  '..kk.kvwvk.kvk..',
  '..kvkvvwvvkvvk..',
  '..kvkvvwvvkvvk..',
  '.kvvvvwwvvvvvk..',
  '.kvvvvwwvvvvvvk.',
  'kvvvvvwwvvvvvvk.',
  'kvvvvvwwvvvvvvvk',
  'kkkkkkkkkkkkkkkk',
  'kkkkkkkkkkkkkkkk',
  '................',
  '................'
];

export const SPIKE_PALETTE: Palette = {
  k: '#181818',
  v: '#909098',
  w: '#e0e0e8'
};

export const LADDER = [
  '.kffk......kffk.',
  '.kffk......kffk.',
  '.kffkkkkkkkkffk.',
  '.kffffffffffffk.',
  '.kffkkkkkkkkffk.',
  '.kffk......kffk.',
  '.kffk......kffk.',
  '.kffk......kffk.',
  '.kffk......kffk.',
  '.kffk......kffk.',
  '.kffkkkkkkkkffk.',
  '.kffffffffffffk.',
  '.kffkkkkkkkkffk.',
  '.kffk......kffk.',
  '.kffk......kffk.',
  '.kffk......kffk.'
];

export const LADDER_PALETTE: Palette = {
  k: '#502808',
  f: '#c08040'
};

export const BRIDGE = [
  'kkkkkkkkkkkkkkkk',
  'wfwfwfwfwfwfwfwf',
  'ffffffffffffffff',
  'kkkkkkkkkkkkkkkk',
  '..k...k...k...k.',
  '..k...k...k...k.',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................'
];

export const DOOR = [
  '....kkkkkkkk....',
  '..kkffffffffkk..',
  '.kffffffffffffk.',
  '.kffffffffffffk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffwkffsfk.',
  '.kfsffffkkffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kfsffffffffsfk.',
  '.kffffffffffffk.'
];

export const DOOR_LOCKED = DOOR.map((row, i) =>
  i >= 6 && i <= 9 ? row.replace('ffffffff', 'ffykkyff') : row
);

export const DOOR_PALETTE: Palette = {
  k: '#201008',
  f: '#a06028',
  s: '#683c18',
  w: '#f0d060',
  y: '#f0d060'
};

export const SPRING0 = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...kkkkkkkkkk...',
  '...kyyyyyyyyk...',
  '....k.k..k.k....',
  '...k.k..k.k.....',
  '....k.k..k.k....',
  '...k.k..k.k.....',
  '..kkkkkkkkkkkk..',
  '..kvvvvvvvvvvk..'
];

export const SPRING1 = [
  '................',
  '................',
  '................',
  '...kkkkkkkkkk...',
  '...kyyyyyyyyk...',
  '....k.k..k.k....',
  '...k.k..k.k.....',
  '....k.k..k.k....',
  '...k.k..k.k.....',
  '....k.k..k.k....',
  '...k.k..k.k.....',
  '....k.k..k.k....',
  '...k.k..k.k.....',
  '....k.k..k.k....',
  '..kkkkkkkkkkkk..',
  '..kvvvvvvvvvvk..'
];

export const SPRING_PALETTE: Palette = {
  k: '#181818',
  y: '#e8a020',
  v: '#909098'
};

export const POLE = [
  '.......ww.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......'
];

export const POLE_TOP = [
  '......kkkk......',
  '.....kyyyyk.....',
  '....kyywyyyk....',
  '....kywyyyyk....',
  '....kyyyyyyk....',
  '.....kyyyyk.....',
  '......kkkk......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......',
  '.......wf.......'
];

export const FLAG = [
  'rrrrrrrrrrrr....',
  'rwwrrrrrrrrrr...',
  'rwwwwrrrrrrrrr..',
  'rrrwwwwrrrrrrrr.',
  'rrrrrwwwwrrrrrr.',
  'rrrrrrrwwrrrrr..',
  'rrrrrrrrrrrrr...',
  'rrrrrrrrrrrr....',
  'rrrrrrrrrr......',
  'rrrrrrrr........',
  'rrrrrr..........',
  'rrrr............',
  '................',
  '................',
  '................',
  '................'
];

export const POLE_PALETTE: Palette = {
  w: '#d8d8e0',
  f: '#787888',
  k: '#181818',
  y: '#e8c030',
  r: '#d83828'
};

// Water / lava (2 animation frames for the surface)
export const LIQUID_TOP0 = [
  'ww..www..ww..www',
  'ffwwfffwwffwwfff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff'
];

export const LIQUID_TOP1 = [
  '.www..ww..www..w',
  'wfffwwffwwfffwwf',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff'
];

export const LIQUID_FILL = [
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffwfffffffffff',
  'ffffffffffffffff',
  'ffffffffffwfffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffwfffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffffff',
  'ffffffffffffwfff',
  'ffffffffffffffff',
  'ffffffffffffffff'
];

export const WATER_PALETTE: Palette = {
  w: '#a8d8f8',
  f: '#2858c0'
};

export const LAVA_PALETTE: Palette = {
  w: '#f8e070',
  f: '#e04810'
};

export const CHECKPOINT = [
  '......kk........',
  '.....kggk.......',
  '....kggggk......',
  '....kggggk......',
  '.....kggk.......',
  '......kk........',
  '......wf........',
  '......wf........',
  '......wf........',
  '......wf........',
  '......wf........',
  '......wf........',
  '......wf........',
  '......wf........',
  '.....kwfk.......',
  '....kkkkkk......'
];

export const CHECKPOINT_LIT = CHECKPOINT.map((row) =>
  row.replace(/g/g, 'y')
);

export const CHECKPOINT_PALETTE: Palette = {
  k: '#181818',
  g: '#487048',
  y: '#f8d020',
  w: '#d8d8e0',
  f: '#787888'
};
