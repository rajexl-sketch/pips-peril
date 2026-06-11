/**
 * Enemy base class: patrol movement, wall/edge turnaround, stomp handling,
 * spark-hit knockout, and a tiny state machine driven by subclasses.
 */
import Phaser from 'phaser';
import { DEPTH, TILE } from '../../core/constants';
import { Player } from '../Player';

export interface EnemyContext {
  /** True if a solid tile occupies the given world position. */
  isSolidAt(x: number, y: number): boolean;
  /** Spawn an enemy projectile. */
  fireSeed(x: number, y: number, vx: number, vy: number): void;
  player: Player;
}

export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  dir: 1 | -1 = -1;
  speed = 25;
  hp = 1;
  /** Can the player kill this by jumping on it? */
  stompable = true;
  /** Does this enemy hurt the player on side contact? */
  harmful = true;
  /** Set when knocked out — falls off screen, no collisions. */
  dead = false;
  /** Avoid walking off ledges (classic red-variant behavior). */
  avoidsEdges = false;

  protected stateTime = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    protected ctx: EnemyContext
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(DEPTH.ENEMY);
  }

  /** Per-frame behavior; subclasses override think(). */
  update(_time: number, dtMs: number): void {
    if (this.dead) {
      if (this.y > this.scene.physics.world.bounds.height + 64) this.destroy();
      return;
    }
    if (!this.active) return;
    this.stateTime += dtMs;
    this.think(dtMs);
  }

  protected abstract think(dtMs: number): void;

  /** Standard ground patrol with wall and (optionally) edge turnaround. */
  protected patrol(): void {
    if (this.body.blocked.left) this.dir = 1;
    else if (this.body.blocked.right) this.dir = -1;
    if (this.avoidsEdges && this.body.blocked.down) {
      const aheadX = this.x + this.dir * (this.body.width / 2 + 2);
      const belowY = this.body.bottom + TILE / 2;
      if (!this.ctx.isSolidAt(aheadX, belowY)) this.dir = -this.dir as 1 | -1;
    }
    this.setVelocityX(this.dir * this.speed);
    this.setFlipX(this.dir > 0);
  }

  /**
   * Player landed on this enemy.
   * Return true if the stomp was accepted (player bounces).
   */
  onStomp(_player: Player): boolean {
    if (!this.stompable) return false;
    this.squish();
    return true;
  }

  /** Default squish: flatten briefly, then remove. */
  protected squish(): void {
    this.dead = true;
    this.body.checkCollision.none = true;
    this.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    this.anims.stop();
    this.scene.time.delayedCall(400, () => this.destroy());
  }

  /** Hit by a spark projectile or a sliding shell: knocked out, flips off. */
  knockOut(fromX: number): void {
    if (this.dead) return;
    this.dead = true;
    this.body.checkCollision.none = true;
    this.body.setAllowGravity(true);
    this.anims.stop();
    this.setFlipY(true);
    this.setVelocity(Math.sign(this.x - fromX) * 60 || 60, -200);
  }

  /** Contact damage check — subclasses can refine (e.g. shells). */
  touchHurtsPlayer(): boolean {
    return this.harmful && !this.dead;
  }
}
