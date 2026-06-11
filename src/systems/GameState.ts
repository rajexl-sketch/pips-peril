/**
 * Run-time session state (lives, score, coins, power) — the part of game
 * state that resets on Game Over, unlike SaveSystem which persists.
 */
import { PowerState, RULES, DIFF_MODS } from '../core/constants';
import { saves } from './SaveSystem';

export class GameState {
  lives: number = RULES.START_LIVES;
  score = 0;
  coins = 0;
  power = PowerState.Small;
  world = 1;
  stage = 1;
  /** Checkpoint reached in the current stage (world px), or -1. */
  checkpointX = -1;
  checkpointY = -1;
  /** One-shot double-jump charge from a Featherleaf. */
  hasFeather = false;

  newRun(world = 1, stage = 1): void {
    const diff = saves.get().settings.difficulty;
    this.lives = DIFF_MODS[diff].startLives;
    this.score = 0;
    this.coins = 0;
    this.power = PowerState.Small;
    this.world = world;
    this.stage = stage;
    this.checkpointX = -1;
    this.checkpointY = -1;
    this.hasFeather = false;
  }

  addScore(points: number): void {
    this.score += points;
  }

  /** Returns true when the coin tally grants an extra life. */
  addCoin(): boolean {
    this.coins++;
    this.addScore(RULES.SCORE_COIN);
    if (this.coins >= RULES.COINS_FOR_LIFE) {
      this.coins -= RULES.COINS_FOR_LIFE;
      this.addLife();
      return true;
    }
    return false;
  }

  addLife(): void {
    this.lives = Math.min(this.lives + 1, RULES.MAX_LIVES);
  }

  /** Returns true if the run is over (no lives left). */
  loseLife(): boolean {
    this.lives--;
    this.power = PowerState.Small;
    this.hasFeather = false;
    return this.lives < 0;
  }

  nextStage(): void {
    this.stage++;
    if (this.stage > 4) {
      this.stage = 1;
      this.world++;
    }
    this.checkpointX = -1;
    this.checkpointY = -1;
  }

  get levelKey(): string {
    return `${this.world}-${this.stage}`;
  }
}

export const gameState = new GameState();
