/**
 * Pip — the original hero of Pip's Peril.
 * A small adventurer in a green cap and blue tunic. All frames face RIGHT;
 * the engine uses flipX for left-facing movement (NES-style mirroring).
 *
 * Palette chars: h cap, d cap shade/hair, s skin, k black, c tunic,
 *                m tunic shade, b boots/gloves, w white.
 */
import { Palette } from '../render';

export const PIP_PALETTE: Palette = {
  h: '#18a0a8', // teal cap — deliberately distinct from any famous plumber
  d: '#0c5458',
  s: '#f8b878',
  k: '#101010',
  c: '#e07820', // orange tunic
  m: '#9c4810',
  b: '#6a3a18',
  w: '#ffffff'
};

/** Spark power palette swap (white-hot tunic, same teal cap). */
export const PIP_SPARK_PALETTE: Palette = {
  ...PIP_PALETTE,
  c: '#f8f8f0',
  m: '#b8b8a8'
};

// ---------------------------------------------------------------- small (16x16)

export const SMALL_IDLE = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '..cccccccc......',
  '.cccccccccc.....',
  '.sccccccccs.....',
  '.sccmccmccs.....',
  '..cccccccc......',
  '..ccc..ccc......',
  '..ccc..ccc......',
  '.bbbb..bbbb.....',
  '.bbbb..bbbb.....'
];

export const SMALL_RUN0 = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '..ccccccccs.....',
  '.ccccccccss.....',
  '.scccccccc......',
  '.sccmccmcc......',
  '..cccccccc......',
  '...ccccccc......',
  '..ccc..ccc......',
  '.bbb....bbbb....',
  'bbbb.....bbb....'
];

export const SMALL_RUN1 = [
  '................',
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '..cccccccc......',
  '.sccccccccs.....',
  '.sccmccmccs.....',
  '..cccccccc......',
  '..cccccccc......',
  '...cccccc.......',
  '...bbbbbb.......',
  '...bbbbbb.......'
];

export const SMALL_RUN2 = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '.sccccccccc.....',
  '.sccccccccc.....',
  '..ccccccccs.....',
  '..ccmccmccs.....',
  '..cccccccc......',
  '..ccccccc.......',
  '..ccc.cccc......',
  '..bbbb..bbbb....',
  '...bbb...bbb....'
];

export const SMALL_JUMP = [
  '....hhhhhh...s..',
  '..hhhhhhhhhh.ss.',
  '..hhhhhhhhhhcss.',
  '..ddsssssksscc..',
  '..ddssssskscc...',
  '..dssssssscc....',
  '...sssssscc.....',
  '..cccccccc......',
  '.sccccccccc.....',
  '.scccccccc......',
  '..ccmccmcc......',
  '..cccccccc......',
  '..ccc.cccc......',
  '..bbb..ccc......',
  '.bbbb..bbbb.....',
  '........bbbb....'
];

export const SMALL_SKID = [
  '......hhhhhh....',
  '....hhhhhhhhhh..',
  '...hhhhhhhhhhh..',
  '....sskssssdd...',
  '....sskssssdd...',
  '....ssssssssd...',
  '.....sssssss....',
  '....cccccccc....',
  '...cccccccccc...',
  '...sccccccccs...',
  '...sccmccmccs...',
  '....cccccccc....',
  '...cccc..ccc....',
  '..cccc...ccc....',
  '.bbbb....bbbb...',
  'bbbb.....bbbb...'
];

export const SMALL_CROUCH = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '..cccccccccc....',
  '.sccccccccccs...',
  '..cccccccccc....',
  '.bbbb...bbbb....',
  '.bbbb...bbbb....'
];

export const SMALL_DEATH = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..ddsk.s.k.s....',
  '..ddss.k.ks.....',
  '..dsk.s.k.ss....',
  '...sssssss......',
  '.s.cccccccc.s...',
  '.sscccccccss....',
  '..cccccccccc....',
  '..ccmccmcc......',
  '..cccccccc......',
  '..ccc..ccc......',
  '..ccc..ccc......',
  '.bbbb..bbbb.....',
  '.bbbb..bbbb.....'
];

export const SMALL_CLIMB = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '...hhhhhhhh.....',
  '...dddddddd.....',
  '...dddddddd.....',
  '..sdddddddds....',
  '..sccccccccs....',
  '..sccccccccs....',
  '...cccccccc.....',
  '...cccccccc.....',
  '...cccccccc.....',
  '...ccc..ccc.....',
  '...ccc..ccc.....',
  '...ccc..ccc.....',
  '..bbbb..bbbb....',
  '..bbbb..bbbb....'
];

// ----------------------------------------------------------------- big (16x24)

export const BIG_IDLE = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '...sssssss......',
  '..cccccccc......',
  '.cccccccccc.....',
  '.cccccccccc.....',
  '.sccccccccs.....',
  '.sccccccccs.....',
  '.sccmccmccs.....',
  '..cccccccc......',
  '..cccccccc......',
  '..ccc..ccc......',
  '..ccc..ccc......',
  '..ccc..ccc......',
  '..ccc..ccc......',
  '.bbbb..bbbb.....',
  '.bbbb..bbbb.....'
];

export const BIG_RUN0 = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '...sssssss......',
  '..ccccccccs.....',
  '.ccccccccsss....',
  '.ccccccccss.....',
  '.scccccccc......',
  '.scccccccc......',
  '.sccmccmcc......',
  '..cccccccc......',
  '..cccccccc......',
  '...ccccccc......',
  '..cccc.ccc......',
  '..ccc..cccc.....',
  '.cccc...ccc.....',
  'bbbb.....bbbb...',
  'bbb.......bbb...'
];

export const BIG_RUN1 = [
  '................',
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '...sssssss......',
  '..cccccccc......',
  '.cccccccccc.....',
  '.sccccccccs.....',
  '.sccccccccs.....',
  '.sccmccmccs.....',
  '..cccccccc......',
  '..cccccccc......',
  '..cccccccc......',
  '...cccccc.......',
  '...cccccc.......',
  '...cccccc.......',
  '...bbbbbb.......',
  '...bbbbbb.......'
];

export const BIG_RUN2 = [
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '...sssssss......',
  '.scccccccc......',
  '.sccccccccc.....',
  '.sccccccccc.....',
  '..ccccccccs.....',
  '..ccccccccs.....',
  '..ccmccmccs.....',
  '..cccccccc......',
  '..cccccccc......',
  '..ccccccc.......',
  '..ccc.cccc......',
  '..ccc..cccc.....',
  '..cccc..ccc.....',
  '..bbbb..bbbb....',
  '...bbb...bbb....'
];

export const BIG_JUMP = [
  '....hhhhhh...ss.',
  '..hhhhhhhhhh.ss.',
  '..hhhhhhhhhhcss.',
  '..hhhhhhhhhccs..',
  '..ddssssskscc...',
  '..ddssssskscc...',
  '..ddssssskscc...',
  '..dssssssscc....',
  '...ssssssscc....',
  '...sssssscc.....',
  '..cccccccc......',
  '.ccccccccc......',
  '.ccccccccc......',
  '.scccccccc......',
  '.scccccccc......',
  '..ccmccmcc......',
  '..cccccccc......',
  '..cccccccc......',
  '..ccc.cccc......',
  '..ccc..ccc......',
  '..bbb..cccc.....',
  '.bbbb...ccc.....',
  '........bbbb....',
  '.........bbb....'
];

export const BIG_SKID = [
  '......hhhhhh....',
  '....hhhhhhhhhh..',
  '...hhhhhhhhhhh..',
  '...hhhhhhhhhhh..',
  '....sskssssdd...',
  '....sskssssdd...',
  '....sskssssdd...',
  '....ssssssssd...',
  '.....sssssss....',
  '.....sssssss....',
  '....cccccccc....',
  '...cccccccccc...',
  '...cccccccccc...',
  '...sccccccccs...',
  '...sccccccccs...',
  '...sccmccmccs...',
  '....cccccccc....',
  '....cccccccc....',
  '...cccc..ccc....',
  '...ccc...ccc....',
  '..cccc...ccc....',
  '..ccc....ccc....',
  '.bbbb....bbbb...',
  'bbbb.....bbbb...'
];

export const BIG_CROUCH = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....hhhhhh......',
  '..hhhhhhhhhh....',
  '..hhhhhhhhhhh...',
  '..hhhhhhhhhhh...',
  '..ddssssskss....',
  '..ddssssskss....',
  '..dsssssssss....',
  '...sssssss......',
  '..cccccccccc....',
  '.scccccccccs....',
  '.scccccccccs....',
  '..cccccccccc....',
  '..ccc...ccc.....',
  '..ccc...ccc.....',
  '.bbbb...bbbb....',
  '.bbbb...bbbb....'
];
