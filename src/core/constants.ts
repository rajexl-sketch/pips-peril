/**
 * Global tuning constants for Pip's Peril.
 *
 * The internal resolution is NES-native (256x240). Everything is tuned in
 * pixels-per-second at that resolution; Phaser scales the canvas up with
 * pixelated rendering for the crisp 8-bit look.
 */

export const TILE = 16;
export const VIEW_W = 256;
export const VIEW_H = 240;
export const ROWS = 15; // playfield rows (15 * 16 = 240)

/** Physics tuning — values chosen to feel weighty-but-responsive, NES style. */
export const PHYS = {
  GRAVITY: 1100,
  // Horizontal movement
  WALK_SPEED: 88,
  RUN_SPEED: 150,
  ACCEL: 420,
  RUN_ACCEL: 520,
  DECEL: 600, // ground friction when no input
  SKID_DECEL: 1100, // turning around at speed
  AIR_ACCEL: 360, // mid-air control, slightly weaker than ground
  // Jumping
  JUMP_VEL: -372, // initial jump impulse (apex ~63px / 4 tiles, NES-like)
  RUN_JUMP_BONUS: -48, // extra jump impulse at full sprint
  JUMP_CUT_VEL: -110, // releasing jump clamps upward velocity to this
  MAX_FALL: 380,
  COYOTE_MS: 80, // grace period after walking off a ledge
  JUMP_BUFFER_MS: 110, // grace period for pressing jump before landing
  STOMP_BOUNCE: -240, // bounce off an enemy's head
  SPRING_VEL: -560,
  HURT_KNOCKBACK_X: 130,
  HURT_KNOCKBACK_Y: -220,
  SWIM_GRAVITY: 320,
  SWIM_IMPULSE: -160,
  SWIM_MAX_FALL: 110
} as const;

/** Game rules */
export const RULES = {
  START_LIVES: 3,
  MAX_LIVES: 99,
  COINS_FOR_LIFE: 100,
  INVINCIBLE_MS: 1800, // i-frames after damage
  LEVEL_TIME: 300, // seconds, overridden per level
  TIME_HURRY: 60, // play hurry-up jingle below this
  SCORE_COIN: 100,
  SCORE_GEM: 1000,
  SCORE_STOMP: 200,
  SCORE_KICK: 400,
  SCORE_POWERUP: 500,
  SCORE_TIME_BONUS: 10, // per second remaining at goal
  SCORE_BOSS: 5000
} as const;

export const WORLDS = 8;
export const STAGES_PER_WORLD = 4;

export enum PowerState {
  Small = 0,
  Big = 1, // "Juniper Berry" growth
  Spark = 2 // "Ember Fruit" projectile power
}

export enum Diff {
  Easy = 0,
  Normal = 1,
  Hard = 2
}

/** Difficulty modifiers applied at level build / damage time. */
export const DIFF_MODS = {
  [Diff.Easy]: { enemyRate: 0.65, timer: 1.5, startLives: 5 },
  [Diff.Normal]: { enemyRate: 1.0, timer: 1.0, startLives: 3 },
  [Diff.Hard]: { enemyRate: 1.35, timer: 0.8, startLives: 3 }
} as const;

export const DEPTH = {
  BG_FAR: 0,
  BG_NEAR: 1,
  TILES: 5,
  COIN: 6,
  ITEM: 7,
  ENEMY: 8,
  PLAYER: 10,
  FX: 12,
  HUD: 20
} as const;

export const STORAGE_KEY = 'pips-peril-save-v1';
