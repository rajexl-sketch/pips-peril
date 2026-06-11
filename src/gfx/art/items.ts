/**
 * Collectibles and power-ups (all original):
 *  - Coin:          spinning gold token (4 frames)
 *  - Gem:           hidden cyan crystal, 3 per level
 *  - Juniper Berry: growth power-up
 *  - Ember Fruit:   projectile (spark) power-up
 *  - Bubble:        temporary shield
 *  - Swift Boots:   speed boost
 *  - Featherleaf:   double-jump bonus
 *  - Sprout:        extra life
 *  - Key:           opens locked doors
 */
import { Palette } from '../render';

export const ITEM_PALETTE: Palette = {
  k: '#181008',
  y: '#f0c020',
  Y: '#f8e8a0',
  o: '#b07010',
  c: '#40d8e8',
  C: '#b0f0f8',
  d: '#1878a0',
  r: '#e03028',
  R: '#f8a098',
  g: '#38a838',
  G: '#185818',
  w: '#f8f8f8',
  b: '#3868e0',
  B: '#a8c8f8',
  m: '#8a4a20',
  e: '#f07820'
};

export const COIN0 = [
  '....kkkkkkkk....',
  '...kyyyyyyyyk...',
  '..kyYYyyyyyyyk..',
  '..kyYyyyyyyyyk..',
  '..kyYyyyyyyyyk..',
  '..kyYyyykkyyyk..',
  '..kyYyyykkyyyk..',
  '..kyYyyykkyyyk..',
  '..kyYyyykkyyyk..',
  '..kyYyyykkyyyk..',
  '..kyYyyyyyyyyk..',
  '..kyYyyyyyyyok..',
  '..kyyyyyyyyook..',
  '...kyyyyyyook...',
  '....kkkkkkkk....',
  '................'
];

export const COIN1 = [
  '.....kkkkkk.....',
  '....kyyyyyyk....',
  '....kyYyyyyk....',
  '....kyYyyyyk....',
  '....kyYykyyk....',
  '....kyYykyyk....',
  '....kyYykyyk....',
  '....kyYykyyk....',
  '....kyYykyyk....',
  '....kyYykyyk....',
  '....kyYyyyyk....',
  '....kyYyyyok....',
  '....kyyyyook....',
  '.....kyyook.....',
  '.....kkkkkk.....',
  '................'
];

export const COIN2 = [
  '......kkkk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kyyk......',
  '......kkkk......',
  '................'
];

export const GEM = [
  '................',
  '....kkkkkkkk....',
  '...kCCcccccck...',
  '..kCCcccccccck..',
  '.kCCcccccccccck.',
  '.kCcccccccccdck.',
  '.kccccccccccdck.',
  '..kccccccccdck..',
  '..kccccccccdck..',
  '...kccccccdck...',
  '...kccccccdck...',
  '....kccccdck....',
  '.....kccdck.....',
  '......kcck......',
  '.......kk.......',
  '................'
];

export const BERRY = [
  '................',
  '........gg......',
  '.......gGGg.....',
  '......gGGg......',
  '......kgg.......',
  '....kkrrkk......',
  '...krrrrrrk.....',
  '..krRrrrrrrk....',
  '..krRrrrrrrk....',
  '.krRrrrrrrrrk...',
  '.krRrrrrrrrrk...',
  '.krrrrrrrrrrk...',
  '..krrrrrrrrk....',
  '..krrrrrrrrk....',
  '...krrrrrrk.....',
  '....kkkkkk......'
];

export const EMBER = [
  '................',
  '.......r........',
  '......rer.......',
  '......rer.......',
  '.....reeer......',
  '.....reyer......',
  '....kkeeekk.....',
  '...keeeeeeek....',
  '..keeYeeeeeek...',
  '..keYeeeeeeek...',
  '.keYeeeeeeeeek..',
  '.keYeeeeeeeeek..',
  '.keeeeeeeeeeek..',
  '..keeeeeeeeek...',
  '...keeeeeeek....',
  '....kkkkkkk.....'
];

export const BUBBLE = [
  '................',
  '....kkkkkkkk....',
  '..kkBBbbbbbbkk..',
  '..kBBbbbbbbbbk..',
  '.kBBbbbbbbbbbbk.',
  '.kBbbbbbbbbbbbk.',
  'kBBbbbbbbbbbbbbk',
  'kBbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbk',
  'kbbbbbbbbbbbbbbk',
  '.kbbbbbbbbbbbbk.',
  '.kbbbbbbbbbbbbk.',
  '..kbbbbbbbbbbk..',
  '..kkbbbbbbbbkk..',
  '....kkkkkkkk....',
  '................'
];

export const BOOTS = [
  '................',
  '................',
  '...kk...........',
  '..kmmk..........',
  '..kmmk..........',
  '..kmmk....ww....',
  '..kmmk...wwww...',
  '..kmmk..wwww....',
  '..kmmkwwwww.....',
  '..kmmmkwww......',
  '..kmmmmk........',
  '..kmmmmmkkk.....',
  '..kmmmmmmmmk....',
  '..kmmmmmmmmk....',
  '...kkkkkkkkk....',
  '................'
];

export const FEATHER = [
  '................',
  '..........ww....',
  '.........wwww...',
  '........wwwww...',
  '.......wwwwww...',
  '......wwwBwww...',
  '.....wwwBwww....',
  '....wwwBwww.....',
  '...wwwBwww......',
  '...wwBwww.......',
  '..wwBwww........',
  '..wBwww.........',
  '..Bww...........',
  '.kB.............',
  'kk..............',
  '................'
];

export const SPROUT = [
  '................',
  '......gg........',
  '.....gGGg.......',
  '....gGGGGg......',
  '....gGGGGg..gg..',
  '.....gGGg..gGGg.',
  '......gG...gGg..',
  '......gG..gGg...',
  '......gGggGg....',
  '......gGGGg.....',
  '.......gG.......',
  '.......gG.......',
  '....kkkkkkkk....',
  '....kmmmmmmk....',
  '.....kmmmmk.....',
  '......kkkk......'
];

export const KEY = [
  '................',
  '....kkkk........',
  '...kyyyyk.......',
  '..kyykkyyk......',
  '..kyk..kyk......',
  '..kyk..kyk......',
  '..kyykkyyk......',
  '...kyyyyk.......',
  '....kyyk........',
  '....kyyk........',
  '....kyykk.......',
  '....kyyyyk......',
  '....kyykk.......',
  '....kyyyyk......',
  '.....kkkk.......',
  '................'
];

// Tiny FX sprites
export const SHARD = ['kffk', 'ffff', 'ffff', 'kffk'];
export const SHARD_PALETTE: Palette = { k: '#683818', f: '#c87038' };

export const DUST = ['.ww.', 'wwww', 'wwww', '.ww.'];
export const DUST_PALETTE: Palette = { w: '#e8e8d8' };

export const SPARKLE = [
  '...w....',
  '...w....',
  '.wwwww..',
  '...w....',
  '...w....',
  '........',
  '........',
  '........'
];
export const SPARKLE_PALETTE: Palette = { w: '#f8f8c0' };
