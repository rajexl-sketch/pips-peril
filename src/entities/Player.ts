/**
 * Pip — player controller.
 *
 * Implements NES-style momentum movement: ground acceleration, run/walk
 * speed tiers, skid turnaround, variable-height jumps (cut on release),
 * coyote time, jump buffering, swim physics, climb, crouch, power states,
 * invincibility frames and knockback.
 *
 * Emits events consumed by GameScene:
 *   'fire' (x, y, dir)  — spark projectile requested
 *   'died'              — death sequence finished falling off screen
 *   'power-changed'     — HUD refresh
 */
import Phaser from 'phaser';
import { PHYS, RULES, PowerState, DEPTH } from '../core/constants';
import { InputManager } from '../systems/InputManager';
import { playSfx } from '../audio/Sfx';

export type MoveState =
  | 'normal'
  | 'climbing'
  | 'dying'
  | 'pipe'
  | 'pole'
  | 'frozen'; // cutscenes / level end walk

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  power = PowerState.Small;
  moveState: MoveState = 'normal';
  facing: 1 | -1 = 1;

  /** Timers (ms remaining) */
  private coyote = 0;
  private jumpBuffer = 0;
  private invincible = 0;
  shieldTime = 0;
  speedTime = 0;
  private fireCooldown = 0;

  hasFeather = false;
  private usedDoubleJump = false;
  private jumping = false;
  private crouching = false;
  inWater = false;
  onLadder = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'pip-s-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(DEPTH.PLAYER);
    this.body.setMaxVelocityY(PHYS.MAX_FALL);
    this.applyBodySize();
  }

  private get prefix(): string {
    if (this.power === PowerState.Spark) return 'pip-x-b';
    return this.power === PowerState.Big ? 'pip-b' : 'pip-s';
  }

  /** Hitbox per power state (slightly narrower than the sprite, NES-style). */
  private applyBodySize(): void {
    if (this.power === PowerState.Small) {
      this.body.setSize(10, 14).setOffset(2, 2);
    } else if (this.crouching) {
      this.body.setSize(10, 14).setOffset(3, 10);
    } else {
      this.body.setSize(10, 21).setOffset(3, 3);
    }
  }

  // ----------------------------------------------------------------- update

  update(input: InputManager, dtMs: number): void {
    if (this.moveState === 'dying' || this.moveState === 'pipe' || this.moveState === 'frozen') {
      return;
    }
    if (this.moveState === 'pole') {
      this.setVelocity(0, 90);
      return;
    }

    this.coyote = Math.max(0, this.coyote - dtMs);
    this.jumpBuffer = Math.max(0, this.jumpBuffer - dtMs);
    this.invincible = Math.max(0, this.invincible - dtMs);
    this.shieldTime = Math.max(0, this.shieldTime - dtMs);
    this.speedTime = Math.max(0, this.speedTime - dtMs);
    this.fireCooldown = Math.max(0, this.fireCooldown - dtMs);

    if (this.moveState === 'climbing') {
      this.updateClimb(input);
    } else if (this.inWater) {
      this.updateSwim(input, dtMs);
    } else {
      this.updateGroundAir(input, dtMs);
    }

    // Spark projectile
    if (
      this.power === PowerState.Spark &&
      input.justDown('run') &&
      this.fireCooldown <= 0 &&
      !this.crouching
    ) {
      this.fireCooldown = 350;
      this.emit('fire', this.x + this.facing * 8, this.y - 2, this.facing);
      playSfx('spark');
    }

    this.updateAppearance();
  }

  private updateGroundAir(input: InputManager, dtMs: number): void {
    const dt = dtMs / 1000;
    const onGround = this.body.blocked.down;
    const running = input.isDown('run') || this.speedTime > 0;
    const boost = this.speedTime > 0 ? 1.25 : 1;
    const maxSpeed = (running ? PHYS.RUN_SPEED : PHYS.WALK_SPEED) * boost;

    if (onGround) {
      this.coyote = PHYS.COYOTE_MS;
      this.usedDoubleJump = false;
    }

    // Crouch (only meaningful when big; small Pip just ducks visually)
    const wantCrouch = input.isDown('down') && onGround && !this.onLadder;
    if (wantCrouch !== this.crouching) {
      this.crouching = wantCrouch;
      this.applyBodySize();
    }

    // ---- Horizontal: acceleration / friction / skid
    let move = 0;
    if (!this.crouching) {
      if (input.isDown('left')) move = -1;
      else if (input.isDown('right')) move = 1;
    }

    const vx = this.body.velocity.x;
    if (move !== 0) {
      this.facing = move as 1 | -1;
      const turning = vx !== 0 && Math.sign(vx) !== move;
      const accel = !onGround
        ? PHYS.AIR_ACCEL
        : turning
          ? PHYS.SKID_DECEL
          : running
            ? PHYS.RUN_ACCEL
            : PHYS.ACCEL;
      let nvx = vx + move * accel * dt;
      nvx = Phaser.Math.Clamp(nvx, -maxSpeed, maxSpeed);
      // When walking (not running) allow existing run momentum to bleed off
      // gradually instead of snapping to walk speed.
      if (Math.abs(vx) > maxSpeed && Math.sign(vx) === move) {
        nvx = Math.sign(vx) * Math.max(maxSpeed, Math.abs(vx) - PHYS.DECEL * dt);
      }
      this.setVelocityX(nvx);
    } else if (onGround) {
      const nvx = Math.abs(vx) <= PHYS.DECEL * dt ? 0 : vx - Math.sign(vx) * PHYS.DECEL * dt;
      this.setVelocityX(nvx);
    }
    // (No input in air: momentum preserved — classic feel.)

    // ---- Jump: buffer + coyote + variable height
    if (input.justDown('jump')) this.jumpBuffer = PHYS.JUMP_BUFFER_MS;

    if (this.jumpBuffer > 0 && (onGround || this.coyote > 0)) {
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.jumping = true;
      const speedFrac = Math.min(Math.abs(this.body.velocity.x) / PHYS.RUN_SPEED, 1);
      this.setVelocityY(PHYS.JUMP_VEL + PHYS.RUN_JUMP_BONUS * speedFrac);
      playSfx('jump');
    } else if (this.jumpBuffer > 0 && this.hasFeather && !this.usedDoubleJump && !onGround) {
      // Featherleaf double jump
      this.jumpBuffer = 0;
      this.usedDoubleJump = true;
      this.jumping = true;
      this.setVelocityY(PHYS.JUMP_VEL * 0.9);
      playSfx('jump');
      this.puff();
    }

    // Variable jump height: releasing the button clamps upward velocity.
    if (this.jumping && !input.isDown('jump') && this.body.velocity.y < PHYS.JUMP_CUT_VEL) {
      this.setVelocityY(PHYS.JUMP_CUT_VEL);
    }
    if (this.body.velocity.y >= 0) this.jumping = false;
  }

  private updateSwim(input: InputManager, dtMs: number): void {
    const dt = dtMs / 1000;
    this.body.setMaxVelocityY(PHYS.SWIM_MAX_FALL);
    let move = 0;
    if (input.isDown('left')) move = -1;
    else if (input.isDown('right')) move = 1;
    if (move !== 0) {
      this.facing = move as 1 | -1;
      this.setVelocityX(
        Phaser.Math.Clamp(this.body.velocity.x + move * PHYS.AIR_ACCEL * 0.7 * dt, -80, 80)
      );
    } else {
      this.setVelocityX(this.body.velocity.x * 0.96);
    }
    if (input.justDown('jump')) {
      this.setVelocityY(PHYS.SWIM_IMPULSE);
      playSfx('splash');
    }
  }

  private updateClimb(input: InputManager): void {
    this.body.setAllowGravity(false);
    let vy = 0;
    let vx = 0;
    if (input.isDown('up')) vy = -55;
    else if (input.isDown('down')) vy = 55;
    if (input.isDown('left')) vx = -40;
    else if (input.isDown('right')) vx = 40;
    this.setVelocity(vx, vy);
    if (input.justDown('jump')) {
      this.stopClimbing();
      this.setVelocityY(PHYS.JUMP_VEL * 0.8);
      playSfx('jump');
    }
  }

  startClimbing(): void {
    if (this.moveState !== 'normal') return;
    this.moveState = 'climbing';
    this.body.setAllowGravity(false);
  }

  stopClimbing(): void {
    if (this.moveState === 'climbing') {
      this.moveState = 'normal';
      this.body.setAllowGravity(true);
    }
  }

  /** Restore air physics when leaving water. */
  exitWater(): void {
    this.body.setMaxVelocityY(PHYS.MAX_FALL);
  }

  // ------------------------------------------------------------- appearance

  private updateAppearance(): void {
    const p = this.prefix;
    this.setFlipX(this.facing < 0);

    // i-frame flicker
    this.setAlpha(this.invincible > 0 && Math.floor(this.invincible / 60) % 2 === 0 ? 0.3 : 1);
    // shield glow
    this.setTint(this.shieldTime > 0 ? 0x88ddff : 0xffffff);

    if (this.moveState === 'climbing') {
      this.anims.stop();
      this.setTexture(`${p}-climb` in this.scene.textures.list ? `${p}-climb` : `${p}-idle`);
      return;
    }
    if (this.crouching) {
      this.anims.stop();
      this.setTexture(`${p}-crouch`);
      return;
    }
    if (!this.body.blocked.down) {
      this.anims.stop();
      this.setTexture(`${p}-jump`);
      return;
    }
    const vx = this.body.velocity.x;
    const moveDir = Math.sign(vx);
    if (moveDir !== 0 && Math.abs(vx) > 10) {
      // Skid: moving opposite to facing at speed
      if (moveDir !== this.facing && Math.abs(vx) > 60) {
        this.anims.stop();
        this.setTexture(`${p}-skid`);
      } else {
        this.play(`${p}-run`, true);
      }
    } else {
      this.anims.stop();
      this.setTexture(`${p}-idle`);
    }
  }

  private puff(): void {
    const d = this.scene.add.image(this.x, this.y + 8, 'dust').setDepth(DEPTH.FX);
    this.scene.tweens.add({
      targets: d,
      alpha: 0,
      scale: 2,
      duration: 250,
      onComplete: () => d.destroy()
    });
  }

  // ------------------------------------------------------------ power/damage

  setPower(power: PowerState, silent = false): void {
    const wasSmall = this.power === PowerState.Small;
    this.power = power;
    // Keep feet planted when the sprite height changes (16 vs 24).
    if (wasSmall && power !== PowerState.Small) this.y -= 4;
    this.applyBodySize();
    if (!silent) playSfx('powerup');
    this.emit('power-changed');
  }

  get isInvincible(): boolean {
    return this.invincible > 0;
  }

  /**
   * Take a hit. Shield absorbs it; Big/Spark downgrade; Small dies.
   * Returns true if the hit killed the player.
   */
  hurt(fromX?: number): boolean {
    if (this.invincible > 0 || this.moveState === 'dying') return false;
    if (this.shieldTime > 0) {
      this.shieldTime = 0;
      this.invincible = RULES.INVINCIBLE_MS / 2;
      playSfx('bump');
      return false;
    }
    if (this.power !== PowerState.Small) {
      this.setPower(PowerState.Small, true);
      this.invincible = RULES.INVINCIBLE_MS;
      playSfx('powerdown');
      const dir = fromX !== undefined ? Math.sign(this.x - fromX) || 1 : -this.facing;
      this.setVelocity(dir * PHYS.HURT_KNOCKBACK_X * 0.6, PHYS.HURT_KNOCKBACK_Y * 0.5);
      return false;
    }
    this.die();
    return true;
  }

  die(): void {
    if (this.moveState === 'dying') return;
    this.moveState = 'dying';
    this.anims.stop();
    this.setTexture('pip-s-death');
    this.setAlpha(1);
    this.body.checkCollision.none = true;
    this.body.setAllowGravity(true);
    this.setVelocity(0, -330);
    this.scene.time.delayedCall(2200, () => this.emit('died'));
  }

  /** Death-by-pit / lava: skip the hop, just notify. */
  fellOffWorld(): void {
    if (this.moveState === 'dying') return;
    this.moveState = 'dying';
    this.body.checkCollision.none = true;
    this.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    this.setVisible(false);
    this.scene.time.delayedCall(1400, () => this.emit('died'));
  }

  grantShield(ms: number): void {
    this.shieldTime = ms;
    playSfx('powerup');
  }

  grantSpeed(ms: number): void {
    this.speedTime = ms;
    playSfx('powerup');
  }

  grantFeather(): void {
    this.hasFeather = true;
    playSfx('powerup');
  }

  bounce(): void {
    this.setVelocityY(PHYS.STOMP_BOUNCE);
  }
}
