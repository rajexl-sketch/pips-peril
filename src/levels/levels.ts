/**
 * Level recipes: 8 worlds x 4 stages, every layout assembled from original
 * chunks with a difficulty curve driven by world tier.
 *
 *   Worlds: 1 Verdant Vale (grass)   2 Echo Caverns (cave)
 *           3 Cloudreach (sky)       4 Gloamwood (night)
 *           5 Mistmarsh (water)      6 Granite Keep (fortress)
 *           7 Cinder Steppes (lava)  8 The Molten Throne (final)
 *
 * Stage 4 of every world is a fortress capped by a King Grum battle.
 */
import { LevelDef, WarpDef } from './LevelBuilder';
import type { ThemeName } from '../gfx/TextureFactory';

const WORLD_THEMES: ThemeName[] = [
  'grass', 'cave', 'sky', 'night', 'water', 'fortress', 'lava', 'lava'
];

export const WORLD_NAMES = [
  'VERDANT VALE',
  'ECHO CAVERNS',
  'CLOUDREACH',
  'GLOAMWOOD',
  'MISTMARSH',
  'GRANITE KEEP',
  'CINDER STEPPES',
  'THE MOLTEN THRONE'
];

/** Difficulty tier: 0 (worlds 1-2), 1 (3-5), 2 (6-8). */
function tier(world: number): 0 | 1 | 2 {
  return world <= 2 ? 0 : world <= 5 ? 1 : 2;
}

/** Theme-flavored set-piece for the world's stage 2. */
function setPiece(theme: ThemeName): string[] {
  switch (theme) {
    case 'cave': return ['CAVE_HALL'];
    case 'sky': return ['SKY_RUN'];
    case 'water': return ['WATERWAY'];
    case 'night': return ['NIGHT_GROVE'];
    case 'fortress': return ['FORT_HALL'];
    case 'lava': return ['LAVA_RUN'];
    default: return ['QROW2'];
  }
}

function stage1(world: number): LevelDef {
  const t = tier(world);
  const theme = WORLD_THEMES[world - 1];
  const gap = (['GAP_S', 'GAP_M', 'GAP_L'] as const)[t];
  const lateFlat = (['FLAT_E', 'FLAT_E2', 'FLAT_E3'] as const)[t];
  return {
    theme,
    time: 300,
    main: {
      chunks: [
        'START', 'FLAT_E', 'QROW', gap, 'PIPES', 'COIN_ARC',
        'CHECKPOINT', lateFlat, ...(t >= 1 ? ['SPIKES'] : []),
        'STEPS', 'GOAL'
      ]
    }
  };
}

function stage2(world: number): LevelDef {
  const t = tier(world);
  const theme = WORLD_THEMES[world - 1];
  const warps: WarpDef[] = [
    { toArea: 'bonus' }, // secret pipe -> bonus room
    { toArea: 'main', marker: 0 } // bonus exit pipe -> back, past the secret
  ];
  const def: LevelDef = {
    theme,
    time: 300,
    main: {
      chunks: [
        'START', 'FLAT_E', ...setPiece(theme), 'PIPE_SECRET', 'LANDING',
        'QROW2', 'CHECKPOINT', ...setPiece(theme),
        ...(t >= 1 ? ['GAP_M'] : []), ...(t >= 2 ? ['SPIKES'] : []),
        'SPRING', 'GOAL'
      ]
    },
    subs: { bonus: { chunks: ['BONUS_COINS'], theme: 'cave' } },
    warps
  };
  // World 1-2 hides the legendary warp room instead of a coin room.
  if (world === 1) {
    def.subs = { warp: { chunks: ['WARP_ROOM'], theme: 'cave' } };
    def.warps = [
      { toArea: 'warp' },
      { toLevel: '2-1' },
      { toLevel: '3-1' },
      { toLevel: '4-1' }
    ];
  }
  return def;
}

function stage3(world: number): LevelDef {
  const t = tier(world);
  const theme = WORLD_THEMES[world - 1];
  const crossing = (['MOVERS', 'FALLERS', 'MOVERS'] as const)[t];
  return {
    theme,
    time: t === 2 ? 250 : 300,
    main: {
      chunks: [
        'START', 'PLAT_HOP', crossing, 'POWER_STOP',
        ...(t >= 1 ? ['STEPS_GAP'] : ['GAP_M']),
        'CHECKPOINT', 'TOWER', ...(t >= 2 ? ['FALLERS'] : []),
        'SPRING', 'COIN_ARC', 'GOAL'
      ]
    }
  };
}

function stage4(world: number): LevelDef {
  const t = tier(world);
  const needsKey = world === 6 || world === 8;
  return {
    theme: 'fortress',
    time: 250,
    boss: true,
    needsKey: false, // boss defeat opens the arena door
    main: {
      chunks: [
        'START', 'FORT_HALL', ...(t >= 1 ? ['SPIKES'] : []),
        ...(needsKey ? ['FORT_KEY'] : []),
        'CHECKPOINT', 'FORT_HALL', ...(t >= 2 ? ['LAVA_RUN'] : []),
        'POWER_STOP', 'BOSS_ARENA'
      ]
    }
  };
}

/** Hand-tuned overrides for flavor stages. */
function overrides(world: number, stage: number, def: LevelDef): LevelDef {
  // 7-3: pure lava gauntlet with a key-locked shortcut exit.
  if (world === 7 && stage === 3) {
    return {
      ...def,
      time: 250,
      main: {
        chunks: [
          'START', 'LAVA_RUN', 'FALLERS', 'CHECKPOINT',
          'FORT_KEY', 'LAVA_RUN', 'EXIT_DOOR'
        ]
      },
      needsKey: true
    };
  }
  // 8-3: the long climb before the throne.
  if (world === 8 && stage === 3) {
    return {
      ...def,
      time: 250,
      main: {
        chunks: [
          'START', 'TOWER', 'SPIKES', 'CHECKPOINT',
          'TOWER', 'FORT_KEY', 'EXIT_DOOR'
        ]
      },
      needsKey: true
    };
  }
  // 5-1: swim-heavy intro to Mistmarsh.
  if (world === 5 && stage === 1) {
    return {
      ...def,
      main: {
        chunks: [
          'START', 'FLAT_E', 'WATERWAY', 'QROW', 'CHECKPOINT',
          'WATERWAY', 'COIN_ARC', 'STEPS', 'GOAL'
        ]
      }
    };
  }
  return def;
}

const builders = [stage1, stage2, stage3, stage4];

/** Get the definition for a world/stage (1-based). */
export function getLevel(world: number, stage: number): LevelDef {
  const w = Math.max(1, Math.min(8, world));
  const s = Math.max(1, Math.min(4, stage));
  return overrides(w, s, builders[s - 1](w));
}
