/**
 * Builds every texture and animation in the game at boot time from the
 * pixel-grid art modules. No external image files — everything is original,
 * procedurally rendered art.
 */
import Phaser from 'phaser';
import { renderGrid } from './render';
import * as P from './art/player';
import * as E from './art/enemies';
import * as T from './art/tiles';
import * as I from './art/items';

export const THEMES = ['grass', 'cave', 'sky', 'night', 'water', 'fortress', 'lava'] as const;
export type ThemeName = (typeof THEMES)[number];

export function buildAllTextures(scene: Phaser.Scene): void {
  // ---- Player (normal + spark palette swap)
  const pipFrames: Record<string, string[]> = {
    'pip-s-idle': P.SMALL_IDLE,
    'pip-s-run0': P.SMALL_RUN0,
    'pip-s-run1': P.SMALL_RUN1,
    'pip-s-run2': P.SMALL_RUN2,
    'pip-s-jump': P.SMALL_JUMP,
    'pip-s-skid': P.SMALL_SKID,
    'pip-s-crouch': P.SMALL_CROUCH,
    'pip-s-death': P.SMALL_DEATH,
    'pip-s-climb': P.SMALL_CLIMB,
    'pip-b-idle': P.BIG_IDLE,
    'pip-b-run0': P.BIG_RUN0,
    'pip-b-run1': P.BIG_RUN1,
    'pip-b-run2': P.BIG_RUN2,
    'pip-b-jump': P.BIG_JUMP,
    'pip-b-skid': P.BIG_SKID,
    'pip-b-crouch': P.BIG_CROUCH
  };
  for (const [key, grid] of Object.entries(pipFrames)) {
    renderGrid(scene, key, grid, P.PIP_PALETTE);
    renderGrid(scene, key.replace('pip-', 'pip-x-'), grid, P.PIP_SPARK_PALETTE);
  }

  // ---- Enemies
  const e = E.ENEMY_PALETTE;
  renderGrid(scene, 'bloop-0', E.BLOOP_WALK0, e);
  renderGrid(scene, 'bloop-1', E.BLOOP_WALK1, e);
  renderGrid(scene, 'bloop-squish', E.BLOOP_SQUISH, e);
  renderGrid(scene, 'flit-0', E.FLIT_FLY0, e);
  renderGrid(scene, 'flit-1', E.FLIT_FLY1, e);
  renderGrid(scene, 'sheldon-0', E.SHELDON_WALK0, e);
  renderGrid(scene, 'sheldon-1', E.SHELDON_WALK1, e);
  renderGrid(scene, 'sheldon-shell', E.SHELDON_SHELL, e);
  renderGrid(scene, 'springle-0', E.SPRINGLE_IDLE, e);
  renderGrid(scene, 'springle-1', E.SPRINGLE_JUMP, e);
  renderGrid(scene, 'rammet-0', E.RAMMET_WALK0, e);
  renderGrid(scene, 'rammet-1', E.RAMMET_WALK1, e);
  renderGrid(scene, 'rammet-charge', E.RAMMET_CHARGE, e);
  renderGrid(scene, 'spitterbud-0', E.SPITTERBUD_IDLE, e);
  renderGrid(scene, 'spitterbud-1', E.SPITTERBUD_SPIT, e);
  renderGrid(scene, 'grum-0', E.GRUM_IDLE, e);
  renderGrid(scene, 'grum-1', E.GRUM_LEAP, e);
  renderGrid(scene, 'seed', E.SEED, e);
  renderGrid(scene, 'spark-0', E.SPARK0, e);
  renderGrid(scene, 'spark-1', E.SPARK1, e);

  // ---- Terrain per theme (palette-swapped ground)
  for (const theme of THEMES) {
    renderGrid(scene, `ground-${theme}`, T.GROUND, T.THEME_TERRAIN[theme]);
  }
  renderGrid(scene, 'brick', T.BRICK, T.BRICK_PALETTE);
  renderGrid(scene, 'block', T.SOLID_BLOCK, T.SOLID_PALETTE);
  renderGrid(scene, 'question-0', T.QUESTION0, T.QUESTION_PALETTE);
  renderGrid(scene, 'question-used', T.QUESTION_USED, T.USED_PALETTE);
  renderGrid(scene, 'pipe-tl', T.PIPE_TL, T.PIPE_PALETTE);
  renderGrid(scene, 'pipe-tr', T.PIPE_TR, T.PIPE_PALETTE);
  renderGrid(scene, 'pipe-bl', T.PIPE_BL, T.PIPE_PALETTE);
  renderGrid(scene, 'pipe-br', T.PIPE_BR, T.PIPE_PALETTE);
  renderGrid(scene, 'platform', T.PLATFORM, T.PLATFORM_PALETTE);
  renderGrid(scene, 'mplatform', T.MPLATFORM, T.PLATFORM_PALETTE);
  renderGrid(scene, 'fplatform', T.FPLATFORM, T.PLATFORM_PALETTE);
  renderGrid(scene, 'spike', T.SPIKE, T.SPIKE_PALETTE);
  renderGrid(scene, 'ladder', T.LADDER, T.LADDER_PALETTE);
  renderGrid(scene, 'bridge', T.BRIDGE, T.PLATFORM_PALETTE);
  renderGrid(scene, 'door', T.DOOR, T.DOOR_PALETTE);
  renderGrid(scene, 'door-locked', T.DOOR_LOCKED, T.DOOR_PALETTE);
  renderGrid(scene, 'spring-0', T.SPRING0, T.SPRING_PALETTE);
  renderGrid(scene, 'spring-1', T.SPRING1, T.SPRING_PALETTE);
  renderGrid(scene, 'pole', T.POLE, T.POLE_PALETTE);
  renderGrid(scene, 'pole-top', T.POLE_TOP, T.POLE_PALETTE);
  renderGrid(scene, 'flag', T.FLAG, T.POLE_PALETTE);
  renderGrid(scene, 'water-0', T.LIQUID_TOP0, T.WATER_PALETTE);
  renderGrid(scene, 'water-1', T.LIQUID_TOP1, T.WATER_PALETTE);
  renderGrid(scene, 'water-fill', T.LIQUID_FILL, T.WATER_PALETTE);
  renderGrid(scene, 'lava-0', T.LIQUID_TOP0, T.LAVA_PALETTE);
  renderGrid(scene, 'lava-1', T.LIQUID_TOP1, T.LAVA_PALETTE);
  renderGrid(scene, 'lava-fill', T.LIQUID_FILL, T.LAVA_PALETTE);
  renderGrid(scene, 'checkpoint', T.CHECKPOINT, T.CHECKPOINT_PALETTE);
  renderGrid(scene, 'checkpoint-lit', T.CHECKPOINT_LIT, T.CHECKPOINT_PALETTE);

  // ---- Items
  const it = I.ITEM_PALETTE;
  renderGrid(scene, 'coin-0', I.COIN0, it);
  renderGrid(scene, 'coin-1', I.COIN1, it);
  renderGrid(scene, 'coin-2', I.COIN2, it);
  renderGrid(scene, 'gem', I.GEM, it);
  renderGrid(scene, 'berry', I.BERRY, it);
  renderGrid(scene, 'ember', I.EMBER, it);
  renderGrid(scene, 'bubble', I.BUBBLE, it);
  renderGrid(scene, 'boots', I.BOOTS, it);
  renderGrid(scene, 'feather', I.FEATHER, it);
  renderGrid(scene, 'sprout', I.SPROUT, it);
  renderGrid(scene, 'key', I.KEY, it);
  renderGrid(scene, 'shard', I.SHARD, I.SHARD_PALETTE);
  renderGrid(scene, 'dust', I.DUST, I.DUST_PALETTE);
  renderGrid(scene, 'sparkle', I.SPARKLE, I.SPARKLE_PALETTE);

  buildBackgrounds(scene);
  buildAnimations(scene);
}

/** Register all sprite animations once (global anim manager). */
function buildAnimations(scene: Phaser.Scene): void {
  const a = scene.anims;
  if (a.exists('coin-spin')) return;

  const mk = (key: string, frames: string[], frameRate: number, repeat = -1) =>
    a.create({ key, frames: frames.map((f) => ({ key: f })), frameRate, repeat });

  // Player animations exist for each size prefix (s=small, b=big) and
  // palette (pip / pip-x). Crouch/jump/skid/idle are single-frame.
  for (const pal of ['pip', 'pip-x']) {
    for (const size of ['s', 'b']) {
      const p = `${pal}-${size}`;
      if (size === 's' || pal !== 'none') {
        const runFrames = [`${p}-run0`, `${p}-run1`, `${p}-run2`, `${p}-run1`];
        mk(`${p}-run`, runFrames, 12);
      }
    }
  }

  mk('coin-spin', ['coin-0', 'coin-1', 'coin-2', 'coin-1'], 8);
  mk('bloop-walk', ['bloop-0', 'bloop-1'], 4);
  mk('flit-fly', ['flit-0', 'flit-1'], 6);
  mk('sheldon-walk', ['sheldon-0', 'sheldon-1'], 5);
  mk('rammet-walk', ['rammet-0', 'rammet-1'], 5);
  mk('rammet-run', ['rammet-0', 'rammet-1'], 12);
  mk('grum-idle', ['grum-0'], 1);
  mk('spark-spin', ['spark-0', 'spark-1'], 12);
  mk('water-flow', ['water-0', 'water-1'], 3);
  mk('lava-flow', ['lava-0', 'lava-1'], 3);
}

// --------------------------------------------------------------- backgrounds

interface BgSpec {
  sky: [string, string]; // vertical gradient top/bottom
  farDraw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

/** Simple seeded RNG so backgrounds are deterministic. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function hills(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, base: number, amp: number, seed: number): void {
  const r = rng(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < 6; i++) {
    const cx = r() * w;
    const rad = 30 + r() * amp;
    ctx.beginPath();
    ctx.arc(cx, h - base + rad * 0.2, rad, Math.PI, 0);
    ctx.fill();
    // wrap-around copy for seamless tiling
    ctx.beginPath();
    ctx.arc(cx - w, h - base + rad * 0.2, rad, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + w, h - base + rad * 0.2, rad, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillRect(0, h - base, w, base);
}

function clouds(ctx: CanvasRenderingContext2D, w: number, color: string, seed: number, n = 5): void {
  const r = rng(seed);
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const x = Math.floor(r() * w);
    const y = 20 + Math.floor(r() * 80);
    for (const [dx, dy, cw, chh] of [
      [0, 4, 28, 8],
      [4, 0, 20, 8],
      [8, -4, 12, 8]
    ]) {
      ctx.fillRect(x + dx, y + dy, cw, chh);
      ctx.fillRect(x + dx - w, y + dy, cw, chh);
    }
  }
}

function stars(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, n = 60): void {
  const r = rng(seed);
  ctx.fillStyle = '#f8f8d8';
  for (let i = 0; i < n; i++) {
    ctx.fillRect(Math.floor(r() * w), Math.floor(r() * (h * 0.7)), 1, 1);
  }
}

export function buildBackgrounds(scene: Phaser.Scene): void {
  const w = 512;
  const h = 240;
  const specs: Record<ThemeName, BgSpec> = {
    grass: {
      sky: ['#58a8f8', '#98d0f8'],
      farDraw: (ctx) => {
        clouds(ctx, w, '#f8f8f8', 11);
        hills(ctx, w, h, '#208038', 24, 60, 21);
        hills(ctx, w, h, '#30a048', 12, 40, 31);
      }
    },
    cave: {
      sky: ['#101018', '#181828'],
      farDraw: (ctx) => {
        hills(ctx, w, h, '#282838', 30, 80, 41);
        ctx.fillStyle = '#303048';
        for (let i = 0; i < 12; i++) {
          const x = (i * 47) % w;
          ctx.fillRect(x, 0, 6, 24 + ((i * 13) % 40)); // stalactites
        }
      }
    },
    sky: {
      sky: ['#3888f0', '#a8d8f8'],
      farDraw: (ctx) => {
        clouds(ctx, w, '#ffffff', 51, 9);
        clouds(ctx, w, '#d8e8f8', 61, 7);
      }
    },
    night: {
      sky: ['#080820', '#202050'],
      farDraw: (ctx) => {
        stars(ctx, w, h, 71);
        ctx.fillStyle = '#e8e8c0';
        ctx.beginPath();
        ctx.arc(400, 48, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#101030';
        ctx.beginPath();
        ctx.arc(394, 44, 12, 0, Math.PI * 2);
        ctx.fill();
        hills(ctx, w, h, '#101038', 20, 50, 81);
      }
    },
    water: {
      sky: ['#287898', '#48a8b8'],
      farDraw: (ctx) => {
        hills(ctx, w, h, '#185868', 28, 70, 91);
        clouds(ctx, w, '#88c8c8', 101, 4);
      }
    },
    fortress: {
      sky: ['#181018', '#302030'],
      farDraw: (ctx) => {
        ctx.fillStyle = '#282028';
        for (let i = 0; i < 8; i++) {
          const x = (i * 67) % w;
          const bw = 28 + ((i * 17) % 20);
          const bh = 60 + ((i * 29) % 70);
          ctx.fillRect(x, h - bh, bw, bh); // distant towers
          ctx.fillStyle = '#403040';
          for (let wy = h - bh + 8; wy < h - 10; wy += 14) {
            ctx.fillRect(x + 6, wy, 4, 6);
          }
          ctx.fillStyle = '#282028';
        }
      }
    },
    lava: {
      sky: ['#280808', '#501810'],
      farDraw: (ctx) => {
        hills(ctx, w, h, '#381010', 26, 80, 111);
        ctx.fillStyle = '#f06020';
        for (let i = 0; i < 10; i++) {
          ctx.fillRect((i * 53) % w, h - 20 + ((i * 7) % 10), 8, 2); // glow
        }
      }
    }
  };

  for (const theme of THEMES) {
    const key = `bg-${theme}`;
    if (scene.textures.exists(key)) continue;
    const tex = scene.textures.createCanvas(key, w, h);
    if (!tex) continue;
    const ctx = tex.getContext();
    const spec = specs[theme];
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, spec.sky[0]);
    grad.addColorStop(1, spec.sky[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    spec.farDraw(ctx, w, h);
    tex.refresh();
  }
}
