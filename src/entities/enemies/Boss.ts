/**
 * King Grum — the fortress boss (worlds 1-7 stage 4, and the final battle).
 *
 * Pattern: idle -> telegraph -> leap at the player -> land (spits seeds at
 * higher phases) -> repeat. Stomp him to deal damage; he gets faster and
 * angrier as HP drops. World number scales HP and aggression.
 */
import Phaser from 'phaser';
import { Enemy, EnemyContext } from './Enemy';
import { Player } from '../Player';
import { playSfx } from '../../audio/Sfx';

export class KingGrum extends Enemy {
  private mode: 'idle' | 'windup' | 'air' | 'recover' | 'stunned' = 'idle';
  private modeTime = 0;
  maxHp: number;
  private aggression: number;

  constructor(scene: Phaser.Scene, x: number, y: number, ctx: EnemyContext, world: number) {
    super(scene, x, y, 'grum-0', ctx);
    this.maxHp = Math.min(3 + Math.floor(world / 3), 6);
    this.hp = this.maxHp;
    this.aggression = 1 + world * 0.08;
    this.body.setSize(26, 26).setOffset(3, 5);
    this.setDepth(9);
  }

  protected think(dtMs: number): void {
    this.modeTime -= dtMs;
    const p = this.ctx.player;

    switch (this.mode) {
      case 'idle':
        this.setVelocityX(0);
        this.setTexture('grum-0');
        this.setFlipX(p.x > this.x);
        if (this.modeTime <= 0) {
          this.mode = 'windup';
          this.modeTime = 400 / this.aggression;
          this.setTexture('grum-1');
        }
        break;
      case 'windup':
        if (this.modeTime <= 0 && this.body.blocked.down) {
          this.mode = 'air';
          const dir = Math.sign(p.x - this.x) || 1;
          const rage = 1 + (1 - this.hp / this.maxHp) * 0.6;
          this.setVelocity(dir * 80 * rage * this.aggression, -300);
          playSfx('bump');
        }
        break;
      case 'air':
        if (this.body.blocked.down && this.body.velocity.y >= 0) {
          this.mode = 'recover';
          this.modeTime = 500 / this.aggression;
          this.setVelocityX(0);
          this.setTexture('grum-0');
          this.scene.cameras.main.shake(120, 0.01);
          // Phase 2 (below 2/3 HP): spit seeds on landing.
          if (this.hp <= (this.maxHp * 2) / 3) {
            const dir = Math.sign(p.x - this.x) || 1;
            this.ctx.fireSeed(this.x, this.y - 10, dir * 90, -160);
            if (this.hp <= this.maxHp / 3) {
              this.ctx.fireSeed(this.x, this.y - 10, dir * 50, -220);
              this.ctx.fireSeed(this.x, this.y - 10, -dir * 60, -180);
            }
          }
        }
        break;
      case 'recover':
        if (this.modeTime <= 0) {
          this.mode = 'idle';
          this.modeTime = (900 - (this.maxHp - this.hp) * 100) / this.aggression;
        }
        break;
      case 'stunned':
        this.setVelocityX(0);
        if (this.modeTime <= 0) {
          this.mode = 'windup';
          this.modeTime = 300;
          this.setTexture('grum-1');
        }
        break;
    }
  }

  onStomp(player: Player): boolean {
    if (this.mode === 'stunned') return true; // already reeling, free bounce
    this.hp--;
    playSfx('bosshit');
    this.emit('boss-hp', this.hp, this.maxHp);
    if (this.hp <= 0) {
      this.defeat();
    } else {
      this.mode = 'stunned';
      this.modeTime = 800;
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(120, () => this.clearTint());
    }
    return true;
  }

  /** Spark projectiles chip the boss instead of instantly knocking out. */
  knockOut(fromX: number): void {
    this.hp--;
    playSfx('bosshit');
    this.emit('boss-hp', this.hp, this.maxHp);
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(120, () => this.clearTint());
    if (this.hp <= 0) this.defeat();
  }

  private defeat(): void {
    this.dead = true;
    this.harmful = false;
    this.body.checkCollision.none = true;
    this.setVelocity(this.flipX ? 40 : -40, -260);
    this.setFlipY(true);
    this.emit('boss-defeated');
  }
}
