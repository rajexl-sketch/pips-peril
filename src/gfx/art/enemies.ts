/**
 * Original enemy roster for Pip's Peril (all face LEFT, flipX for right):
 *  - Bloop:      slow round blob walker
 *  - Flit:       sine-wave flying moth
 *  - Sheldon:    armored beetle; retreats into a kickable shell when stomped
 *  - Springle:   hopping frog
 *  - Rammet:     horned beetle that charges when it spots the player
 *  - Spitterbud: rooted flower that spits seeds
 *  - King Grum:  fortress boss, a giant horned toad
 */
import { Palette } from '../render';

export const ENEMY_PALETTE: Palette = {
  k: '#101010',
  w: '#ffffff',
  b: '#a85820', // bloop body
  e: '#703810', // bloop feet / shade
  p: '#9048c8', // flit wings
  q: '#5828a0', // flit body
  g: '#40a040', // green (sheldon body / springle)
  G: '#1f6020', // green shade
  y: '#e8c840', // shell highlight / springle belly
  o: '#d86018', // shell / rammet carapace
  r: '#c83020', // rammet horn / angry
  v: '#c8c8c8', // gray
  t: '#806858' // toad brown
};

// Bloop — 16x16
export const BLOOP_WALK0 = [
  '................',
  '................',
  '.....kkkkkk.....',
  '...kkbbbbbbkk...',
  '..kbbbbbbbbbbk..',
  '..kbbbbbbbbbbk..',
  '.kbwwkbbbbwwkbk.',
  '.kbwwkbbbbwwkbk.',
  '.kbbbbbbbbbbbbk.',
  '.kbbbkbbbbkbbbk.',
  '.kbbbbkkkkbbbbk.',
  '.kbbbbbbbbbbbbk.',
  '..kbbbbbbbbbbk..',
  '...kbbbbbbbbk...',
  '..eeee....eeee..',
  '.eeeee....eeeee.'
];

export const BLOOP_WALK1 = [
  '................',
  '................',
  '.....kkkkkk.....',
  '...kkbbbbbbkk...',
  '..kbbbbbbbbbbk..',
  '..kbbbbbbbbbbk..',
  '.kbwwkbbbbwwkbk.',
  '.kbwwkbbbbwwkbk.',
  '.kbbbbbbbbbbbbk.',
  '.kbbbkbbbbkbbbk.',
  '.kbbbbkkkkbbbbk.',
  '.kbbbbbbbbbbbbk.',
  '..kbbbbbbbbbbk..',
  '...kbbbbbbbbk...',
  '...eeee..eeee...',
  '....eeee..eeee..'
];

export const BLOOP_SQUISH = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....kkkkkk.....',
  '..kkkbbbbbbkkk..',
  '.kbwwkbbbbwwkbk.',
  '.kbbbbbbbbbbbbk.',
  '..kkkkkkkkkkkk..',
  '.eeeee....eeeee.'
];

// Flit — 16x16
export const FLIT_FLY0 = [
  '................',
  '.pp..........pp',
  '.pppp......pppp',
  '.pppppp..pppppp',
  '..pppppppppppp.',
  '...pppppppppp..',
  '.....qqqqqq.....',
  '....qqwkqwkq....',
  '....qqwkqwkq....',
  '....qqqqqqqq....',
  '.....qqqqqq.....',
  '......qkkq......',
  '.....k....k.....',
  '................',
  '................',
  '................'
];

export const FLIT_FLY1 = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....qqqqqq.....',
  '....qqwkqwkq....',
  '...pqqwkqwkqp...',
  '..ppqqqqqqqqpp..',
  '.ppppqqqqqqpppp.',
  '.pppppp..pppppp.',
  '.pppp......pppp.',
  '.pp..........pp.',
  '......k..k......',
  '................',
  '................'
];

// Sheldon — 16x16, shell-back beetle
export const SHELDON_WALK0 = [
  '................',
  '................',
  '......kkkkkkk...',
  '....kkooooooykk.',
  '...koooyooooooy.',
  '..koyooooyooooo.',
  '..koooyooooyook.',
  '.kgoooooyooook..',
  '.kggkoooooook...',
  'kgwkgkkkkkkk....',
  'kgwkgggggggk....',
  'kggggggggggk....',
  '.kgggkggggk.....',
  '..GGG..GGG......',
  '.GGG....GGG.....',
  '................'
];

export const SHELDON_WALK1 = [
  '................',
  '................',
  '......kkkkkkk...',
  '....kkooooooykk.',
  '...koooyooooooy.',
  '..koyooooyooooo.',
  '..koooyooooyook.',
  '.kgoooooyooook..',
  '.kggkoooooook...',
  'kgwkgkkkkkkk....',
  'kgwkgggggggk....',
  'kggggggggggk....',
  '.kgggkggggk.....',
  '...GGGGGG.......',
  '...GGG.GGG......',
  '................'
];

export const SHELDON_SHELL = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....kkkkkk.....',
  '...kkooooookk...',
  '..koooyoooyook..',
  '.koyooooyooooyk.',
  '.koooyooooyoook.',
  '.kooooooooooook.',
  '..kyooyooyooyk..',
  '...kkkkkkkkkk...',
  '....vvvvvvvv....',
  '................',
  '................'
];

// Springle — 16x16 hopping frog
export const SPRINGLE_IDLE = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '...kk......kk...',
  '..kwwk....kwwk..',
  '..kwkk....kwkk..',
  '.kgggggggggggk..',
  '.kgggggggggggk..',
  'kgyyyyyyyyyyygk.',
  'kgyyyyyyyyyyygk.',
  'kggggggggggggk..',
  '.kGGgk....kgGGk.',
  '.GGGG......GGGG.',
  '................'
];

export const SPRINGLE_JUMP = [
  '...kk......kk...',
  '..kwwk....kwwk..',
  '..kwkk....kwkk..',
  '.kgggggggggggk..',
  '.kgggggggggggk..',
  'kgyyyyyyyyyyygk.',
  'kgyyyyyyyyyyygk.',
  'kggggggggggggk..',
  '.kggggggggggk...',
  '..kgk....kgk....',
  '..kgk....kgk....',
  '..kgk....kgk....',
  '.kGGk....kGGk...',
  '.GGG......GGG...',
  '................',
  '................'
];

// Rammet — 16x16 charging horned beetle
export const RAMMET_WALK0 = [
  '................',
  '................',
  '................',
  '.r....kkkkkkk...',
  '.rr.kkvvvvvvvkk.',
  '.rrkvvvvvvvvvvk.',
  'rrrvvkwkvvvvvvk.',
  '.rrvvkkkvvvvvvk.',
  'rrrvvvvvvvvvvvk.',
  '.kovvvvvvvvvvok.',
  '.koooooooooooo..',
  '.kooooooooooook.',
  '..kook..kook....',
  '..koo....koo....',
  '.kkk....kkk.....',
  '................'
];

export const RAMMET_WALK1 = [
  '................',
  '................',
  '................',
  '.r....kkkkkkk...',
  '.rr.kkvvvvvvvkk.',
  '.rrkvvvvvvvvvvk.',
  'rrrvvkwkvvvvvvk.',
  '.rrvvkkkvvvvvvk.',
  'rrrvvvvvvvvvvvk.',
  '.kovvvvvvvvvvok.',
  '.koooooooooooo..',
  '.kooooooooooook.',
  '...kook..kook...',
  '...koo....koo...',
  '....kkk....kkk..',
  '................'
];

export const RAMMET_CHARGE = [
  '................',
  '................',
  '................',
  'rr....kkkkkkk...',
  'rrr.kkvvvvvvvkk.',
  'rrrkvvvvvvvvvvk.',
  'rrrvvkrkvvvvvvk.',
  'rrrvvkkkvvvvvvk.',
  'rrrvvvvvvvvvvvk.',
  '.kovvvvvvvvvvok.',
  '.koooooooooooo..',
  '.kooooooooooook.',
  '..kook..kook....',
  '.koo......koo...',
  'kkk......kkk....',
  '................'
];

// Spitterbud — 16x16 rooted spitting flower
export const SPITTERBUD_IDLE = [
  '................',
  '....rrrrrr......',
  '...rryyyyrr.....',
  '..rryywwyyrr....',
  '..rryWWWWyrr....',
  '..rryWWWWyrr....',
  '..rryyyyyyrr....',
  '...rryyyyrr.....',
  '....rrrrrr......',
  '......GG........',
  '..gG..GG..Gg....',
  '...gGGGGGGg.....',
  '......GG........',
  '......GG........',
  '....gGGGGg......',
  '...ggGGGGgg.....'
].map((r) => r.replace(/W/g, 'k'));

export const SPITTERBUD_SPIT = [
  '................',
  '....rrrrrr......',
  '...rryyyyrr.....',
  '..rryyyyyyrr....',
  '..rryykkyyrr....',
  '..rrykkkkyrr....',
  '..rryykkyyrr....',
  '...rryyyyrr.....',
  '....rrrrrr......',
  '......GG........',
  '..gG..GG..Gg....',
  '...gGGGGGGg.....',
  '......GG........',
  '......GG........',
  '....gGGGGg......',
  '...ggGGGGgg.....'
];

// King Grum — 32x32 boss toad
export const GRUM_IDLE = [
  '................................',
  '................................',
  '......rr................rr......',
  '.....rrrr..............rrrr....',
  '.....rrrr..............rrrr....',
  '......kkkkkkkkkkkkkkkkkkkk......',
  '....kkttttttttttttttttttttkk....',
  '...kttttttttttttttttttttttttk...',
  '..ktttkwwwwkttttttkwwwwkttttk...',
  '..ktttkwkkwkttttttkwkkwkttttk...',
  '..ktttkwkkwkttttttkwkkwkttttk...',
  '..ktttkwwwwkttttttkwwwwkttttk...',
  '..kttttttttttttttttttttttttttk..',
  '..kttttttttttttttttttttttttttk..',
  '..ktttkkkkkkkkkkkkkkkkkkkktttk..',
  '..ktttkyyyyyyyyyyyyyyyyyyktttk..',
  '..ktttkykykykykykykykykyyktttk..',
  '..ktttkkkkkkkkkkkkkkkkkkkktttk..',
  '..kttttttttttttttttttttttttttk..',
  '..kttttttttttttttttttttttttttk..',
  '...kttttttttttttttttttttttttk...',
  '...kttttttttttttttttttttttttk...',
  '....kttttttttttttttttttttttk....',
  '....ktttttttttttttttttttttk.....',
  '...kkttttkkkkkkkkkkkkttttkk.....',
  '..kttttttk..........kttttttk....',
  '..kttttttk..........kttttttk....',
  '..ktttttk............ktttttk....',
  '...kkkkk..............kkkkk.....',
  '..eeeeeee............eeeeeee....',
  '.eeeeeeeee..........eeeeeeeee...',
  '................................'
];

export const GRUM_LEAP = [
  '................................',
  '......rr................rr......',
  '.....rrrr..............rrrr....',
  '.....rrrr..............rrrr....',
  '......kkkkkkkkkkkkkkkkkkkk......',
  '....kkttttttttttttttttttttkk....',
  '...kttttttttttttttttttttttttk...',
  '..ktttkrrrrkttttttkrrrrkttttk...',
  '..ktttkrkkrkttttttkrkkrkttttk...',
  '..ktttkrkkrkttttttkrkkrkttttk...',
  '..ktttkrrrrkttttttkrrrrkttttk...',
  '..kttttttttttttttttttttttttttk..',
  '..kttttttttttttttttttttttttttk..',
  '..ktttkkkkkkkkkkkkkkkkkkkktttk..',
  '..ktttkyyyyyyyyyyyyyyyyyyktttk..',
  '..ktttkyykkyykkyykkyykkyyktttk..',
  '..ktttkkkkkkkkkkkkkkkkkkkktttk..',
  '..kttttttttttttttttttttttttttk..',
  '..kttttttttttttttttttttttttttk..',
  '...kttttttttttttttttttttttttk...',
  '...kttttttttttttttttttttttttk...',
  '....kttttttttttttttttttttttk....',
  '.....kttttttttttttttttttttk.....',
  '......kkkttttttttttttkkkk.......',
  '....kkttttkkkkkkkkkkttttkk......',
  '...kttttttk........kttttttk.....',
  '..kttttttk..........kttttttk....',
  '..ktttttk............ktttttk....',
  '..kkkkk................kkkkk....',
  'eeeeeee..............eeeeeee....',
  'eeeeeee..............eeeeeee....',
  '................................'
];

// Projectiles — 8x8
export const SEED = [
  '..kkkk..',
  '.kggggk.',
  'kggGGggk',
  'kgGGGGgk',
  'kgGGGGgk',
  'kggGGggk',
  '.kggggk.',
  '..kkkk..'
];

export const SPARK0 = [
  '...rr...',
  '..ryyr..',
  '.rywwyr.',
  'rywwwwyr',
  'rywwwwyr',
  '.rywwyr.',
  '..ryyr..',
  '...rr...'
];

export const SPARK1 = [
  'r..rr..r',
  '.ryyyyr.',
  '.yywwyy.',
  'rywwwwyr',
  'rywwwwyr',
  '.yywwyy.',
  '.ryyyyr.',
  'r..rr..r'
];
