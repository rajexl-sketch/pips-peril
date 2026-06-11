/**
 * Concrete enemy types. Each implements one classic platformer archetype
 * with an original design and behavior tuning.
 */
import Phaser from 'phaser';
import { Enemy, EnemyContext } from './Enemy';
import { Player } from '../Player';
import { playSfx } from '../../audio/Sfx';

/** Bloop — slow round walker. The bread-and-butter stompable enemy. */
export class Bloop extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext, avoidEdges = false) {
    super(scene, x, y, 'bloop-0', ctx);
    this.speed = 22;
    this.avoidsEdges = avoidEdges;
    this.body.setSize(13, 12).setOffset(1, 4);
    this.play('bloop-walk');
  }

  protected think(): void {
    this.patrol();
  }

  protected squish(): void {
    this.setTexture('bloop-squish');
    super.squish();
    this.setTexture('bloop-squish'); // squish() stops anims; reassert frame
  }
}

/** Flit — flying moth, sine-wave drift. Stompable in mid-air. */
export class Flit extends Enemy {
  private baseY: number;
  private amplitude = 24;

  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext) {
    super(scene, x, y, 'flit-0', ctx);
    this.baseY = y;
    this.speed = 34;
    this.body.setAllowGravity(false);
    this.body.setSize(12, 10).setOffset(2, 4);
    this.play('flit-fly');
  }

  protected think(): void {
    if (this.body.blocked.left) this.dir = 1;
    else if (this.body.blocked.right) this.dir = -1;
    this.setVelocityX(this.dir * this.speed);
    this.y = this.baseY + Math.sin(this.stateTime / 350) * this.amplitude;
    this.setFlipX(this.dir > 0);
  }

  knockOut(fromX: number): void {
    this.body.setAllowGravity(true);
    super.knockOut(fromX);
  }
}

/** Sheldon — armored beetle. Stomp tucks it into a kickable sliding shell. */
export class Sheldon extends Enemy {
  shellState: 'walking' | 'shell' | 'sliding' = 'walking';
  private wakeTimer = 0;
  /** Grace window after a kick so the shell can't instantly hurt the kicker. */
  private kickGrace = 0;
  static SLIDE_SPEED = 180;

  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext) {
    super(scene, x, y, 'sheldon-0', ctx);
    this.speed = 20;
    this.avoidsEdges = true;
    this.body.setSize(13, 12).setOffset(1, 3);
    this.play('sheldon-walk');
  }

  protected think(dtMs: number): void {
    if (this.shellState === 'walking') {
      this.patrol();
    } else if (this.shellState === 'shell') {
      this.setVelocityX(0);
      this.wakeTimer -= dtMs;
      if (this.wakeTimer <= 0) {
        this.shellState = 'walking';
        this.play('sheldon-walk');
        this.harmful = true;
      }
    } else {
      // sliding: bounce off walls
      this.kickGrace = Math.max(0, this.kickGrace - dtMs);
      if (this.body.blocked.left) this.dir = 1;
      else if (this.body.blocked.right) this.dir = -1;
      this.setVelocityX(this.dir * Sheldon.SLIDE_SPEED);
    }
  }

  onStomp(player: Player): boolean {
    if (this.shellState === 'walking') {
      this.enterShell();
    } else if (this.shellState === 'sliding') {
      this.shellState = 'shell';
      this.wakeTimer = 5000;
      this.setVelocityX(0);
      this.harmful = false;
    } else {
      this.kick(player.x);
    }
    return true;
  }

  private enterShell(): void {
    this.shellState = 'shell';
    this.wakeTimer = 5000;
    this.anims.stop();
    this.setTexture('sheldon-shell');
    this.setVelocityX(0);
    this.harmful = false;
    this.avoidsEdges = false;
  }

  /** Side contact while in shell: kick it. */
  kick(fromX: number): void {
    this.shellState = 'sliding';
    this.dir = this.x >= fromX ? 1 : -1;
    this.setVelocityX(this.dir * Sheldon.SLIDE_SPEED);
    this.harmful = true; // a sliding shell hurts on touch
    this.kickGrace = 300;
    playSfx('kick');
  }

  /** A resting shell is safe to touch; a just-kicked one has a grace window. */
  touchHurtsPlayer(): boolean {
    if (this.dead) return false;
    if (this.shellState === 'shell') return false;
    if (this.shellState === 'sliding' && this.kickGrace > 0) return false;
    return true;
  }

  get isSlidingShell(): boolean {
    return this.shellState === 'sliding' && !this.dead;
  }
}

/** Springle — hopping frog; jumps toward the player. */
export class Springle extends Enemy {
  private hopTimer = 800;

  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext) {
    super(scene, x, y, 'springle-0', ctx);
    this.body.setSize(14, 12).setOffset(1, 3);
  }

  protected think(dtMs: number): void {
    if (this.body.blocked.down) {
      this.setTexture('springle-0');
      this.setVelocityX(0);
      this.hopTimer -= dtMs;
      if (this.hopTimer <= 0) {
        this.hopTimer = 900 + Math.random() * 500;
        this.dir = this.ctx.player.x < this.x ? -1 : 1;
        this.setTexture('springle-1');
        this.setVelocity(this.dir * 70, -260);
      }
    }
    this.setFlipX(this.dir > 0);
  }
}

/** Rammet — patrols slowly; charges when the player is on its level. */
export class Rammet extends Enemy {
  private mode: 'patrol' | 'charge' | 'cooldown' = 'patrol';
  private cooldown = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext) {
    super(scene, x, y, 'rammet-0', ctx);
    this.speed = 18;
    this.avoidsEdges = true;
    this.body.setSize(14, 11).setOffset(1, 4);
    this.play('rammet-walk');
  }

  protected think(dtMs: number): void {
    const p = this.ctx.player;
    if (this.mode === 'patrol') {
      this.patrol();
      const sameLevel = Math.abs(p.y - this.y) < 24;
      const facingPlayer = Math.sign(p.x - this.x) === this.dir;
      const inRange = Math.abs(p.x - this.x) < 120;
      if (sameLevel && facingPlayer && inRange) {
        this.mode = 'charge';
        this.anims.stop();
        this.setTexture('rammet-charge');
        playSfx('bump');
      }
    } else if (this.mode === 'charge') {
      // Charge straight ahead; stop at walls or ledges.
      this.setVelocityX(this.dir * 130);
      this.setFlipX(this.dir > 0);
      const hitWall = this.body.blocked.left || this.body.blocked.right;
      let atEdge = false;
      if (this.body.blocked.down) {
        const aheadX = this.x + this.dir * (this.body.width / 2 + 3);
        atEdge = !this.ctx.isSolidAt(aheadX, this.body.bottom + 8);
      }
      if (hitWall || atEdge) {
        this.mode = 'cooldown';
        this.cooldown = 700;
        this.setVelocityX(0);
      }
    } else {
      this.cooldown -= dtMs;
      this.setVelocityX(0);
      if (this.cooldown <= 0) {
        this.mode = 'patrol';
        this.dir = -this.dir as 1 | -1;
        this.play('rammet-walk');
      }
    }
  }

  /** Armored head: only stompable while not charging. */
  onStomp(player: Player): boolean {
    if (this.mode === 'charge') return false;
    return super.onStomp(player);
  }
}

/** Spitterbud — rooted flower that lobs seeds at the player. */
export class Spitterbud extends Enemy {
  private spitTimer = 1500;

  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext) {
    super(scene, x, y, 'spitterbud-0', ctx);
    this.body.setSize(12, 14).setOffset(2, 2);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  protected think(dtMs: number): void {
    const p = this.ctx.player;
    this.spitTimer -= dtMs;
    const dist = Math.abs(p.x - this.x);
    if (this.spitTimer <= 0 && dist < 140 && dist > 20) {
      this.spitTimer = 1800 + Math.random() * 700;
      this.setTexture('spitterbud-1');
      this.scene.time.delayedCall(250, () => {
        if (!this.active || this.dead) return;
        const dir = Math.sign(p.x - this.x) || 1;
        this.ctx.fireSeed(this.x + dir * 6, this.y - 4, dir * 70, -120);
        this.setTexture('spitterbud-0');
      });
    }
  }
}
