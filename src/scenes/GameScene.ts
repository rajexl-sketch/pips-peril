/**
 * GameScene — the gameplay orchestrator.
 *
 * Builds the level from parsed chunk data (tilemap + object placements),
 * wires all collisions, and runs the per-frame loop: input, player physics,
 * enemy AI, environment checks (water/lava/ladders), warps, camera, timer.
 */
import Phaser from 'phaser';
import {
  TILE, VIEW_W, VIEW_H, DEPTH, RULES, PHYS, PowerState, DIFF_MODS
} from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import {
  parseLevel, ParsedLevel, Placement, SOLID_TILES, ONEWAY_TILES, TILE_IDX,
  areaAt, warpLanding, BuiltArea
} from '../levels/LevelBuilder';
import { getLevel } from '../levels/levels';
import { Player } from '../entities/Player';
import { Enemy, EnemyContext } from '../entities/enemies/Enemy';
import {
  Bloop, Flit, Sheldon, Springle, Rammet, Spitterbud
} from '../entities/enemies/types';
import { KingGrum } from '../entities/enemies/Boss';
import { InputManager } from '../systems/InputManager';
import { gameState } from '../systems/GameState';
import { saves } from '../systems/SaveSystem';
import { chiptune } from '../audio/Chiptune';
import { TRACKS, THEME_MUSIC } from '../audio/tracks';
import { playSfx } from '../audio/Sfx';

/** Order of tile textures in the generated tileset strip (= TILE_IDX). */
const TILESET_ORDER = (theme: string) => [
  `ground-${theme}`, 'block', 'pipe-tl', 'pipe-tr', 'pipe-bl', 'pipe-br',
  'platform', 'bridge', 'ladder', 'water-0', 'water-fill', 'lava-0', 'lava-fill'
];

interface WarpZone {
  rect: Phaser.Geom.Rectangle;
  warpIndex: number;
  kind: 'pipe' | 'door';
  sprite?: Phaser.GameObjects.Image;
}

export class GameScene extends Phaser.Scene {
  private parsed!: ParsedLevel;
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private player!: Player;
  private inputMgr!: InputManager;

  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private questions!: Phaser.Physics.Arcade.StaticGroup;
  private hiddens!: Phaser.Physics.Arcade.StaticGroup;
  private springs!: Phaser.Physics.Arcade.StaticGroup;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private gems!: Phaser.Physics.Arcade.StaticGroup;
  private keys!: Phaser.Physics.Arcade.StaticGroup;
  private checkpoints!: Phaser.Physics.Arcade.StaticGroup;
  private items!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.Group;
  private fallers!: Phaser.Physics.Arcade.Group;
  private seeds!: Phaser.Physics.Arcade.Group;
  private sparks!: Phaser.Physics.Arcade.Group;

  private warpZones: WarpZone[] = [];
  private lockedDoors: Phaser.GameObjects.Image[] = [];
  private flagX = -1;
  private boss: KingGrum | null = null;
  private bossMusicOn = false;
  private doorUnlocked = false;
  private hasKey = false;

  private bgFar!: Phaser.GameObjects.TileSprite;
  private timeLeft = 300;
  private hurryPlayed = false;
  private ending = false;
  private currentArea!: BuiltArea;
  private enemyCounter = 0;

  constructor() {
    super('Game');
  }

  // =================================================================== create

  create(): void {
    const def = getLevel(gameState.world, gameState.stage);
    this.parsed = parseLevel(def);
    this.ending = false;
    this.boss = null;
    this.bossMusicOn = false;
    this.doorUnlocked = false;
    this.hasKey = false;
    this.hurryPlayed = false;
    this.warpZones = [];
    this.lockedDoors = [];
    this.flagX = -1;
    this.enemyCounter = 0;

    const diff = DIFF_MODS[saves.get().settings.difficulty];
    this.timeLeft = def.time * diff.timer;
    this.registry.set('time', this.timeLeft);
    this.registry.set('bossHp', undefined);

    const widthPx = this.parsed.widthTiles * TILE;
    this.physics.world.setBounds(0, -TILE * 4, widthPx, VIEW_H + TILE * 8);

    // Parallax backdrop (fixed to camera; scrolled manually for parallax).
    this.bgFar = this.add
      .tileSprite(0, 0, VIEW_W, VIEW_H, `bg-${def.theme}`)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(DEPTH.BG_FAR);
    if (saves.get().settings.highContrast) this.bgFar.setAlpha(0.35);

    this.buildTilemap(def.theme);
    this.createGroups();
    this.spawnPlacements();
    this.createPlayer();
    this.wireCollisions();

    // Camera: pixel-perfect follow with a deadzone for stable framing.
    const cam = this.cameras.main;
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true, 1, 1);
    cam.setDeadzone(48, 64);
    this.currentArea = areaAt(this.parsed, Math.floor(this.player.x / TILE));
    this.applyCameraBounds();

    this.inputMgr = new InputManager(this);
    this.scene.launch('UI');

    chiptune.play(THEME_MUSIC[def.theme] ?? TRACKS.grass);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputMgr.destroy();
    });
  }

  private buildTilemap(theme: string): void {
    // Compose the tileset strip texture for this theme on first use.
    const tilesetKey = `tiles-${theme}`;
    if (!this.textures.exists(tilesetKey)) {
      const order = TILESET_ORDER(theme);
      const tex = this.textures.createCanvas(tilesetKey, order.length * TILE, TILE);
      if (tex) {
        const ctx = tex.getContext();
        order.forEach((key, i) => {
          ctx.drawImage(this.textures.get(key).getSourceImage() as HTMLCanvasElement, i * TILE, 0);
        });
        tex.refresh();
      }
    }

    const map = this.make.tilemap({
      data: this.parsed.grid,
      tileWidth: TILE,
      tileHeight: TILE
    });
    const tiles = map.addTilesetImage(tilesetKey)!;
    this.layer = map.createLayer(0, tiles, 0, 0)!;
    this.layer.setDepth(DEPTH.TILES);
    this.layer.setCollision(SOLID_TILES as unknown as number[]);
    this.layer.forEachTile((t) => {
      if ((ONEWAY_TILES as readonly number[]).includes(t.index)) {
        t.setCollision(false, false, true, false);
      }
    });
  }

  private createGroups(): void {
    this.bricks = this.physics.add.staticGroup();
    this.questions = this.physics.add.staticGroup();
    this.hiddens = this.physics.add.staticGroup();
    this.springs = this.physics.add.staticGroup();
    this.spikes = this.physics.add.staticGroup();
    this.coins = this.physics.add.staticGroup();
    this.gems = this.physics.add.staticGroup();
    this.keys = this.physics.add.staticGroup();
    this.checkpoints = this.physics.add.staticGroup();
    this.items = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.platforms = this.physics.add.group({ allowGravity: false, immovable: true });
    this.fallers = this.physics.add.group({ allowGravity: false, immovable: true });
    this.seeds = this.physics.add.group();
    this.sparks = this.physics.add.group();
  }

  /** Enemy AI services shared by all enemies. */
  private get enemyCtx(): EnemyContext {
    const scene = this;
    return {
      isSolidAt: (x, y) => {
        const t = scene.layer.getTileAtWorldXY(x, y);
        return !!t && (SOLID_TILES as readonly number[]).includes(t.index);
      },
      fireSeed: (x, y, vx, vy) => scene.fireSeed(x, y, vx, vy),
      // Live accessor: enemies spawn before the player is created, so the
      // reference must resolve at call time, not capture time.
      get player() {
        return scene.player;
      }
    };
  }

  private spawnPlacements(): void {
    const diff = DIFF_MODS[saves.get().settings.difficulty];
    for (const p of this.parsed.placements) {
      const x = p.tx * TILE + TILE / 2;
      const y = p.ty * TILE + TILE / 2;
      switch (p.type) {
        case 'brick':
          this.bricks.create(x, y, 'brick');
          break;
        case 'question': {
          const q = this.questions.create(x, y, 'question-0') as Phaser.Physics.Arcade.Sprite;
          q.setData('content', p.meta?.content ?? 'coin');
          break;
        }
        case 'hidden': {
          const hb = this.hiddens.create(x, y, 'question-used') as Phaser.Physics.Arcade.Sprite;
          hb.setVisible(false);
          hb.setData('content', p.meta?.content ?? 'coin');
          break;
        }
        case 'coin':
          (this.coins.create(x, y, 'coin-0') as Phaser.Physics.Arcade.Sprite).play('coin-spin');
          break;
        case 'gem': {
          const idx = (p.meta?.index as number) ?? 0;
          const got = saves.gemsFor(gameState.world, gameState.stage)[idx];
          const g = this.gems.create(x, y, 'gem') as Phaser.Physics.Arcade.Sprite;
          g.setData('index', idx);
          if (got) g.setAlpha(0.35);
          break;
        }
        case 'spring': {
          const s = this.springs.create(x, y, 'spring-0') as Phaser.Physics.Arcade.Sprite;
          s.body!.setSize(12, 8);
          (s.body as Phaser.Physics.Arcade.StaticBody).setOffset(2, 8);
          break;
        }
        case 'spike': {
          const sp = this.spikes.create(x, y, 'spike') as Phaser.Physics.Arcade.Sprite;
          (sp.body as Phaser.Physics.Arcade.StaticBody).setSize(12, 8);
          (sp.body as Phaser.Physics.Arcade.StaticBody).setOffset(2, 4);
          break;
        }
        case 'checkpoint':
          this.checkpoints.create(x, y, 'checkpoint');
          break;
        case 'flag':
          this.buildFlag(p);
          break;
        case 'mplatform': {
          const m = this.platforms.create(x + TILE / 2, y, 'mplatform') as Phaser.Physics.Arcade.Sprite;
          m.setData('axis', p.meta?.axis ?? 'x');
          m.setData('origin', p.meta?.axis === 'y' ? m.y : m.x);
          m.setData('range', 56);
          const body = m.body as Phaser.Physics.Arcade.Body;
          body.setSize(32, 8);
          if (p.meta?.axis === 'y') body.setVelocityY(30);
          else body.setVelocityX(30);
          // Riders get carried by platform friction.
          body.setFriction(1, 0);
          break;
        }
        case 'fplatform': {
          const f = this.fallers.create(x, y - 4, 'fplatform') as Phaser.Physics.Arcade.Sprite;
          (f.body as Phaser.Physics.Arcade.Body).setSize(16, 8);
          f.setData('home', { x: f.x, y: f.y });
          break;
        }
        case 'key':
          this.keys.create(x, y, 'key');
          break;
        case 'item':
          this.spawnItem(x, y, p.meta?.kind as string);
          break;
        case 'door': {
          const img = this.add.image(x, y, 'door').setDepth(DEPTH.TILES);
          this.warpZones.push({
            rect: new Phaser.Geom.Rectangle(x - 8, y - 8, 16, 16),
            warpIndex: (p.meta?.warpIndex as number) ?? 0,
            kind: 'door',
            sprite: img
          });
          break;
        }
        case 'lockeddoor': {
          const img = this.add.image(x, y, 'door-locked').setDepth(DEPTH.TILES);
          this.lockedDoors.push(img);
          break;
        }
        case 'warp-pipe':
          this.warpZones.push({
            rect: new Phaser.Geom.Rectangle(p.tx * TILE, p.ty * TILE - 6, TILE * 2, 8),
            warpIndex: (p.meta?.warpIndex as number) ?? 0,
            kind: 'pipe'
          });
          break;
        case 'enemy':
          this.spawnEnemy(p, x, y, diff.enemyRate);
          break;
        case 'spawn':
        case 'landing':
          break; // consumed elsewhere
      }
    }
  }

  /** Difficulty-scaled enemy spawning (deterministic skip/duplicate). */
  private spawnEnemy(p: Placement, x: number, y: number, rate: number): void {
    const kind = p.meta?.kind as string;
    if (kind !== 'boss') {
      this.enemyCounter++;
      if (rate < 1 && this.enemyCounter % 3 === 0) return; // easy: skip every 3rd
    }
    const make = (ex: number): Enemy | null => {
      switch (kind) {
        case 'bloop': return new Bloop(this, ex, y, this.enemyCtx);
        case 'bloopE': return new Bloop(this, ex, y, this.enemyCtx, true);
        case 'flit': return new Flit(this, ex, y - 16, this.enemyCtx);
        case 'sheldon': return new Sheldon(this, ex, y, this.enemyCtx);
        case 'springle': return new Springle(this, ex, y, this.enemyCtx);
        case 'rammet': return new Rammet(this, ex, y, this.enemyCtx);
        case 'spitterbud': return new Spitterbud(this, ex, y, this.enemyCtx);
        case 'boss': {
          const b = new KingGrum(this, ex, y - 8, this.enemyCtx, gameState.world);
          this.boss = b;
          b.on('boss-hp', (hp: number, max: number) => this.registry.set('bossHp', [hp, max]));
          b.on('boss-defeated', () => this.onBossDefeated());
          this.registry.set('bossHp', [b.hp, b.maxHp]);
          return b;
        }
        default: return null;
      }
    };
    const e = make(x);
    if (e) this.enemies.add(e, false);
    if (kind !== 'boss' && rate > 1 && this.enemyCounter % 2 === 0) {
      const dup = make(x + 24);
      if (dup) this.enemies.add(dup, false);
    }
  }

  private buildFlag(p: Placement): void {
    const px = p.tx * TILE + TILE / 2;
    // Pole from the marker row down to the ground.
    let groundY = p.ty;
    while (groundY < 14 && this.parsed.grid[groundY + 1][p.tx] === TILE_IDX.EMPTY) groundY++;
    this.add.image(px, p.ty * TILE + TILE / 2, 'pole-top').setDepth(DEPTH.TILES);
    for (let ty = p.ty + 1; ty <= groundY; ty++) {
      this.add.image(px, ty * TILE + TILE / 2, 'pole').setDepth(DEPTH.TILES);
    }
    const flag = this.add.image(px + 9, (p.ty + 1) * TILE, 'flag').setOrigin(0, 0).setDepth(DEPTH.TILES);
    flag.setData('isFlag', true);
    this.flagX = px;
  }

  private createPlayer(): void {
    let sx = 32;
    let sy = 12 * TILE;
    const spawn = this.parsed.placements.find((p) => p.type === 'spawn' && p.area === 'main');
    if (spawn) {
      sx = spawn.tx * TILE + TILE / 2;
      sy = spawn.ty * TILE;
    }
    if (gameState.checkpointX >= 0) {
      sx = gameState.checkpointX;
      sy = gameState.checkpointY;
    }
    this.player = new Player(this, sx, sy);
    this.player.setPower(gameState.power, true);
    this.player.hasFeather = gameState.hasFeather;
    this.player.on('fire', (x: number, y: number, dir: number) => this.fireSpark(x, y, dir));
    this.player.on('died', () => this.onPlayerDied());
    this.player.on('power-changed', () => {
      gameState.power = this.player.power;
    });
  }

  // ============================================================== collisions

  private wireCollisions(): void {
    const ph = this.physics;
    const player = this.player;

    ph.add.collider(player, this.layer);
    ph.add.collider(player, this.platforms);
    ph.add.collider(player, this.fallers, (_p, f) =>
      this.triggerFaller(f as Phaser.Physics.Arcade.Sprite)
    );

    ph.add.collider(player, this.bricks, (_p, b) =>
      this.onHeadHit(b as Phaser.Physics.Arcade.Sprite, 'brick')
    );
    ph.add.collider(player, this.questions, (_p, b) =>
      this.onHeadHit(b as Phaser.Physics.Arcade.Sprite, 'question')
    );
    ph.add.collider(
      player,
      this.hiddens,
      (_p, b) => this.onHeadHit(b as Phaser.Physics.Arcade.Sprite, 'hidden'),
      // Hidden blocks are only solid when bumped from below while rising.
      (_p, b) => {
        const block = b as Phaser.Physics.Arcade.Sprite;
        if (block.visible) return true;
        return player.body.velocity.y < 0 && player.body.top >= block.getBounds().bottom - 6;
      }
    );

    ph.add.collider(player, this.springs, (_p, s) => {
      const spring = s as Phaser.Physics.Arcade.Sprite;
      if (player.body.touching.down) {
        spring.setTexture('spring-1');
        this.time.delayedCall(150, () => spring.active && spring.setTexture('spring-0'));
        const strong = this.inputMgr.isDown('jump');
        player.setVelocityY(PHYS.SPRING_VEL * (strong ? 1 : 0.78));
        playSfx('spring');
      }
    });

    ph.add.overlap(player, this.spikes, () => {
      if (!player.isInvincible) {
        if (player.hurt()) this.onPlayerDeath();
      }
    });

    ph.add.overlap(player, this.coins, (_p, c) => {
      (c as Phaser.GameObjects.GameObject).destroy();
      this.collectCoin();
    });

    ph.add.overlap(player, this.gems, (_p, g) => {
      const gem = g as Phaser.Physics.Arcade.Sprite;
      const idx = gem.getData('index') as number;
      gem.destroy();
      saves.collectGem(gameState.world, gameState.stage, idx);
      gameState.addScore(RULES.SCORE_GEM);
      this.popText(gem.x, gem.y - 10, String(RULES.SCORE_GEM));
      playSfx('gem');
    });

    ph.add.overlap(player, this.keys, (_p, k) => {
      (k as Phaser.GameObjects.GameObject).destroy();
      this.hasKey = true;
      gameState.addScore(RULES.SCORE_KICK);
      playSfx('key');
      if (this.parsed.def.needsKey) this.unlockDoors();
    });

    ph.add.overlap(player, this.checkpoints, (_p, c) => {
      const cp = c as Phaser.Physics.Arcade.Sprite;
      if (cp.texture.key !== 'checkpoint-lit') {
        cp.setTexture('checkpoint-lit');
        gameState.checkpointX = cp.x;
        gameState.checkpointY = cp.y - 8;
        playSfx('gem');
        this.popText(cp.x, cp.y - 14, 'CHECKPOINT!');
      }
    });

    ph.add.collider(this.items, this.layer);
    ph.add.collider(this.items, this.bricks);
    ph.add.collider(this.items, this.questions);
    ph.add.overlap(player, this.items, (_p, i) => this.collectItem(i as Phaser.Physics.Arcade.Sprite));

    ph.add.collider(this.enemies, this.layer);
    ph.add.collider(this.enemies, this.bricks);
    ph.add.collider(this.enemies, this.questions);
    ph.add.collider(this.enemies, this.platforms);
    ph.add.overlap(player, this.enemies, (_p, e) => this.onPlayerEnemyContact(e as Enemy));
    // Sliding shells mow down other enemies.
    ph.add.overlap(this.enemies, this.enemies, (a, b) => {
      const ea = a as Enemy;
      const eb = b as Enemy;
      const shellA = ea instanceof Sheldon && ea.isSlidingShell;
      const shellB = eb instanceof Sheldon && eb.isSlidingShell;
      if (shellA && !eb.dead && eb !== ea && !shellB) {
        eb.knockOut(ea.x);
        this.scoreKill(eb);
      } else if (shellB && !ea.dead && !shellA) {
        ea.knockOut(eb.x);
        this.scoreKill(ea);
      }
    });

    ph.add.collider(this.seeds, this.layer, (s) => (s as Phaser.GameObjects.GameObject).destroy());
    ph.add.overlap(player, this.seeds, (_p, s) => {
      (s as Phaser.GameObjects.GameObject).destroy();
      if (player.hurt()) this.onPlayerDeath();
    });

    ph.add.collider(this.sparks, this.layer, (s) => {
      const spark = s as Phaser.Physics.Arcade.Sprite;
      const body = spark.body as Phaser.Physics.Arcade.Body;
      if (body.blocked.left || body.blocked.right) spark.destroy();
    });
    ph.add.overlap(this.sparks, this.enemies, (s, e) => {
      const enemy = e as Enemy;
      if (enemy.dead) return;
      (s as Phaser.GameObjects.GameObject).destroy();
      enemy.knockOut(this.player.x);
      if (!(enemy instanceof KingGrum)) this.scoreKill(enemy);
    });
  }

  // ====================================================== interaction logic

  /** Player vs enemy: stomp from above, kick shells, otherwise take damage. */
  private onPlayerEnemyContact(enemy: Enemy): void {
    if (enemy.dead || this.ending || this.player.moveState !== 'normal') return;
    const pBody = this.player.body;
    const stomping = pBody.velocity.y > 40 && pBody.bottom <= enemy.body.top + 10;

    if (stomping) {
      const accepted = enemy.onStomp(this.player);
      if (accepted) {
        this.player.bounce();
        playSfx('stomp');
        if (!(enemy instanceof KingGrum)) this.scoreKill(enemy);
        return;
      }
    }
    if (enemy instanceof Sheldon && enemy.shellState === 'shell') {
      enemy.kick(this.player.x);
      gameState.addScore(RULES.SCORE_KICK);
      return;
    }
    if (enemy.touchHurtsPlayer() && !this.player.isInvincible) {
      if (this.player.hurt(enemy.x)) this.onPlayerDeath();
    }
  }

  private scoreKill(enemy: Enemy): void {
    gameState.addScore(RULES.SCORE_STOMP);
    this.popText(enemy.x, enemy.y - 12, String(RULES.SCORE_STOMP));
  }

  /** Bumping bricks / question blocks / hidden blocks from below. */
  private onHeadHit(block: Phaser.Physics.Arcade.Sprite, kind: string): void {
    if (!this.player.body.touching.up || !block.body!.touching.down) return;

    if (kind === 'brick') {
      if (this.player.power !== PowerState.Small) {
        this.breakBrick(block);
      } else {
        this.bumpBlock(block);
        playSfx('bump');
      }
      return;
    }
    // Question / hidden block
    if (block.getData('used')) {
      playSfx('bump');
      return;
    }
    block.setData('used', true);
    block.setVisible(true);
    block.setTexture('question-used');
    this.bumpBlock(block);
    const content = block.getData('content') as string;
    if (content === 'coin') {
      this.coinPop(block.x, block.y - TILE);
    } else if (content === 'power') {
      const kind2 = this.player.power === PowerState.Small ? 'berry' : 'ember';
      this.riseItem(block.x, block.y - TILE, kind2);
    } else if (content === 'oneup') {
      this.riseItem(block.x, block.y - TILE, 'sprout');
    }
  }

  private bumpBlock(block: Phaser.Physics.Arcade.Sprite): void {
    this.tweens.add({
      targets: block,
      y: block.y - 5,
      duration: 70,
      yoyo: true,
      onComplete: () => block.body && (block.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    });
  }

  private breakBrick(block: Phaser.Physics.Arcade.Sprite): void {
    playSfx('break');
    gameState.addScore(50);
    for (const [vx, vy] of [[-60, -220], [60, -220], [-40, -120], [40, -120]]) {
      const shard = this.physics.add.image(block.x, block.y, 'shard').setDepth(DEPTH.FX);
      shard.setVelocity(vx, vy);
      (shard.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
      this.time.delayedCall(900, () => shard.destroy());
    }
    block.destroy();
  }

  private coinPop(x: number, y: number): void {
    this.collectCoin();
    const c = this.add.sprite(x, y, 'coin-0').setDepth(DEPTH.FX);
    c.play('coin-spin');
    this.tweens.add({
      targets: c,
      y: y - 24,
      alpha: 0,
      duration: 380,
      ease: 'Cubic.Out',
      onComplete: () => c.destroy()
    });
  }

  private collectCoin(): void {
    const gotLife = gameState.addCoin();
    playSfx('coin');
    if (gotLife) {
      playSfx('oneup');
      this.popText(this.player.x, this.player.y - 20, '1UP!');
    }
  }

  /** Item rises out of a bumped block, then activates physics. */
  private riseItem(x: number, y: number, kind: string): void {
    const img = this.add.image(x, y + TILE - 2, kind).setDepth(DEPTH.ITEM - 1);
    playSfx('powerup');
    this.tweens.add({
      targets: img,
      y: y - 2,
      duration: 450,
      onComplete: () => {
        img.destroy();
        this.spawnItem(x, y - 2, kind, true);
      }
    });
  }

  private spawnItem(x: number, y: number, kind: string, walks = false): void {
    const item = this.items.create(x, y, kind) as Phaser.Physics.Arcade.Sprite;
    item.setData('kind', kind);
    item.setDepth(DEPTH.ITEM);
    const body = item.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 13);
    if (walks && (kind === 'berry' || kind === 'sprout')) {
      body.setVelocityX(35);
      body.setBounceX(1);
    } else if (!walks) {
      body.setAllowGravity(false);
      body.setImmovable(true);
    }
  }

  private collectItem(item: Phaser.Physics.Arcade.Sprite): void {
    const kind = item.getData('kind') as string;
    item.destroy();
    gameState.addScore(RULES.SCORE_POWERUP);
    this.popText(this.player.x, this.player.y - 18, String(RULES.SCORE_POWERUP));
    switch (kind) {
      case 'berry':
        this.player.setPower(
          this.player.power === PowerState.Small ? PowerState.Big : this.player.power
        );
        break;
      case 'ember':
        this.player.setPower(PowerState.Spark);
        break;
      case 'bubble':
        this.player.grantShield(10000);
        break;
      case 'boots':
        this.player.grantSpeed(8000);
        break;
      case 'feather':
        this.player.grantFeather();
        gameState.hasFeather = true;
        break;
      case 'sprout':
        gameState.addLife();
        playSfx('oneup');
        break;
    }
  }

  private triggerFaller(f: Phaser.Physics.Arcade.Sprite): void {
    if (f.getData('falling') || !this.player.body.touching.down) return;
    f.setData('falling', true);
    this.tweens.add({ targets: f, x: f.x + 1, duration: 40, yoyo: true, repeat: 6 });
    this.time.delayedCall(350, () => {
      if (!f.active) return;
      const body = f.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(true);
      body.setImmovable(false);
      body.checkCollision.none = true;
      // Respawn at home position a few seconds later.
      this.time.delayedCall(2600, () => {
        if (!f.active) return;
        const home = f.getData('home') as { x: number; y: number };
        body.setAllowGravity(false);
        body.setImmovable(true);
        body.checkCollision.none = false;
        body.setVelocity(0, 0);
        f.setPosition(home.x, home.y);
        f.setData('falling', false);
      });
    });
  }

  // ============================================================ projectiles

  private fireSpark(x: number, y: number, dir: number): void {
    if (this.sparks.countActive(true) >= 2) return; // classic 2-on-screen cap
    const s = this.sparks.create(x, y, 'spark-0') as Phaser.Physics.Arcade.Sprite;
    s.play('spark-spin');
    s.setDepth(DEPTH.FX);
    const body = s.body as Phaser.Physics.Arcade.Body;
    body.setSize(6, 6);
    body.setVelocity(dir * 230, 60);
    body.setBounceY(0.85);
    this.time.delayedCall(2500, () => s.active && s.destroy());
  }

  private fireSeed(x: number, y: number, vx: number, vy: number): void {
    const s = this.seeds.create(x, y, 'seed') as Phaser.Physics.Arcade.Sprite;
    s.setDepth(DEPTH.FX);
    const body = s.body as Phaser.Physics.Arcade.Body;
    body.setSize(6, 6);
    body.setVelocity(vx, vy);
    this.time.delayedCall(4000, () => s.active && s.destroy());
  }

  // ================================================================== warps

  private tryWarps(): void {
    const p = this.player;
    for (const wz of this.warpZones) {
      if (!Phaser.Geom.Rectangle.Overlaps(wz.rect, p.getBounds())) continue;
      if (wz.kind === 'pipe' && p.body.blocked.down && this.inputMgr.justDown('down')) {
        this.enterWarp(wz, 'pipe');
        return;
      }
      if (wz.kind === 'door' && p.body.blocked.down && this.inputMgr.justDown('up')) {
        this.enterWarp(wz, 'door');
        return;
      }
    }
    // Locked exit doors
    for (const door of this.lockedDoors) {
      if (
        Math.abs(p.x - door.x) < 10 &&
        Math.abs(p.y - door.y) < 14 &&
        this.inputMgr.justDown('up')
      ) {
        if (this.doorUnlocked) {
          playSfx('door');
          this.completeLevel();
        } else {
          playSfx('bump');
          this.popText(door.x, door.y - 18, this.parsed.def.needsKey ? 'NEED KEY!' : 'LOCKED!');
        }
        return;
      }
    }
  }

  private enterWarp(wz: WarpZone, kind: 'pipe' | 'door'): void {
    const warp = this.parsed.warps[wz.warpIndex];
    if (!warp) return;
    const p = this.player;
    p.moveState = 'pipe';
    p.setVelocity(0, 0);
    p.body.setAllowGravity(false);
    playSfx(kind === 'pipe' ? 'pipe' : 'door');

    const finish = () => {
      if (warp.toLevel) {
        const [w, s] = warp.toLevel.split('-').map(Number);
        gameState.world = w;
        gameState.stage = s;
        gameState.checkpointX = -1;
        gameState.checkpointY = -1;
        chiptune.stop();
        this.scene.stop('UI');
        this.scene.start('LevelIntro');
        return;
      }
      const land = warpLanding(this.parsed, warp);
      p.setPosition(land.tx * TILE + TILE / 2, land.ty * TILE);
      p.body.setAllowGravity(true);
      p.moveState = 'normal';
      this.currentArea = areaAt(this.parsed, land.tx);
      this.applyCameraBounds();
      this.cameras.main.centerOn(p.x, p.y);
    };

    if (kind === 'pipe') {
      this.tweens.add({ targets: p, y: p.y + 18, duration: 500, onComplete: finish });
    } else {
      this.cameras.main.fadeOut(200);
      this.time.delayedCall(250, () => {
        this.cameras.main.fadeIn(200);
        finish();
      });
    }
  }

  private applyCameraBounds(): void {
    const a = this.currentArea;
    this.cameras.main.setBounds(a.startX * TILE, 0, a.widthTiles * TILE, VIEW_H);
  }

  // ============================================================ level flow

  private onBossDefeated(): void {
    gameState.addScore(RULES.SCORE_BOSS);
    this.popText(this.player.x, this.player.y - 24, String(RULES.SCORE_BOSS));
    this.registry.set('bossHp', undefined);
    this.unlockDoors();
    chiptune.play(TRACKS.clear);
  }

  private unlockDoors(): void {
    this.doorUnlocked = true;
    for (const d of this.lockedDoors) d.setTexture('door');
    playSfx('door');
  }

  /** Reaching the goal flagpole. */
  private reachFlag(): void {
    if (this.ending) return;
    this.ending = true;
    const p = this.player;
    p.moveState = 'pole';
    p.x = this.flagX - 6;
    p.setVelocity(0, 90);
    playSfx('flag');
    chiptune.stop();
    this.time.delayedCall(900, () => {
      p.moveState = 'frozen';
      p.setVelocity(0, 0);
      chiptune.play(TRACKS.clear);
      const bonus = Math.ceil(this.timeLeft) * RULES.SCORE_TIME_BONUS;
      gameState.addScore(bonus);
      this.popText(p.x, p.y - 24, `TIME BONUS ${bonus}`);
      this.time.delayedCall(2200, () => this.completeLevel());
    });
  }

  private completeLevel(): void {
    if (this.ending && this.flagX < 0) return; // double-guard for door exits
    this.ending = true;
    saves.completeStage(gameState.world, gameState.stage);
    saves.submitScore(gameState.score);
    chiptune.stop();
    this.scene.stop('UI');
    if (gameState.world === 8 && gameState.stage === 4) {
      this.scene.start('Victory');
    } else {
      gameState.nextStage();
      this.scene.start('LevelIntro');
    }
  }

  /** Small-state death started (animation runs, then 'died' fires). */
  private onPlayerDeath(): void {
    chiptune.play(TRACKS.death);
    this.registry.set('bossHp', undefined);
  }

  private onPlayerDied(): void {
    chiptune.stop();
    const over = gameState.loseLife();
    this.scene.stop('UI');
    if (over) {
      this.scene.start('GameOver');
    } else {
      this.scene.start('LevelIntro');
    }
  }

  private popText(x: number, y: number, str: string): void {
    const t = this.add.bitmapText(x, y, FONT_KEY, str).setOrigin(0.5).setDepth(DEPTH.FX);
    this.tweens.add({
      targets: t,
      y: y - 16,
      alpha: 0,
      duration: 800,
      onComplete: () => t.destroy()
    });
  }

  // ================================================================== update

  update(time: number, dtMs: number): void {
    this.inputMgr.update();

    if (this.inputMgr.justDown('pause') && !this.ending) {
      this.scene.pause();
      this.scene.launch('Pause');
      return;
    }

    this.player.update(this.inputMgr, dtMs);
    this.updateEnvironment();
    this.tryWarps();
    this.updateAreaClamp();
    this.updateEnemies(time, dtMs);
    this.updatePlatforms();
    this.updateTimer(dtMs);
    this.updateBossMusic();

    // Parallax
    this.bgFar.tilePositionX = this.cameras.main.scrollX * 0.35;

    // Goal flag
    if (this.flagX >= 0 && !this.ending && Math.abs(this.player.x - this.flagX) < 6 &&
        this.player.moveState === 'normal') {
      this.reachFlag();
    }

    // Fell off the world
    if (this.player.y > VIEW_H + TILE * 3 && this.player.moveState !== 'dying') {
      this.onPlayerDeath();
      this.player.fellOffWorld();
    }
  }

  /** Water / lava / ladder tile sensing at the player's position. */
  private updateEnvironment(): void {
    const p = this.player;
    if (p.moveState === 'dying') return;
    const tile = this.layer.getTileAtWorldXY(p.x, p.y + 2);
    const idx = tile ? tile.index : TILE_IDX.EMPTY;

    // Lava: instant death
    if (idx === TILE_IDX.LAVA_TOP || idx === TILE_IDX.LAVA_FILL) {
      this.onPlayerDeath();
      p.fellOffWorld();
      playSfx('splash');
      return;
    }

    // Water
    const inWater = idx === TILE_IDX.WATER_TOP || idx === TILE_IDX.WATER_FILL;
    if (inWater && !p.inWater) playSfx('splash');
    if (!inWater && p.inWater) p.exitWater();
    p.inWater = inWater;

    // Ladder
    const ladderHere = idx === TILE_IDX.LADDER;
    p.onLadder = ladderHere;
    if (ladderHere && p.moveState === 'normal' &&
        (this.inputMgr.isDown('up') || this.inputMgr.isDown('down'))) {
      p.startClimbing();
      p.x = (tile!.x + 0.5) * TILE; // center on the ladder
    } else if (!ladderHere && p.moveState === 'climbing') {
      p.stopClimbing();
    }
  }

  /** Keep the player inside the current area; switch camera bounds on warp. */
  private updateAreaClamp(): void {
    const a = this.currentArea;
    const minX = a.startX * TILE + 6;
    const maxX = (a.startX + a.widthTiles) * TILE - 6;
    if (this.player.x < minX) {
      this.player.x = minX;
      this.player.setVelocityX(Math.max(0, this.player.body.velocity.x));
    } else if (this.player.x > maxX) {
      this.player.x = maxX;
      this.player.setVelocityX(Math.min(0, this.player.body.velocity.x));
    }
  }

  private updateEnemies(time: number, dtMs: number): void {
    const camX = this.cameras.main.scrollX;
    for (const child of this.enemies.getChildren()) {
      const e = child as Enemy;
      if (!e.active) continue;
      // NES-style activation: enemies idle until they near the viewport.
      const dist = e.x - (camX + VIEW_W);
      if (dist > TILE * 4) {
        e.body.setVelocity(0, 0);
        continue;
      }
      e.update(time, dtMs);
    }
  }

  /** Patrol bounds for moving platforms (velocity flip at range ends). */
  private updatePlatforms(): void {
    for (const child of this.platforms.getChildren()) {
      const m = child as Phaser.Physics.Arcade.Sprite;
      const axis = m.getData('axis') as string;
      const origin = m.getData('origin') as number;
      const range = m.getData('range') as number;
      const body = m.body as Phaser.Physics.Arcade.Body;
      if (axis === 'y') {
        if (m.y > origin + range && body.velocity.y > 0) body.setVelocityY(-30);
        else if (m.y < origin - range && body.velocity.y < 0) body.setVelocityY(30);
      } else {
        if (m.x > origin + range && body.velocity.x > 0) body.setVelocityX(-30);
        else if (m.x < origin - range && body.velocity.x < 0) body.setVelocityX(30);
      }
    }
  }

  private updateTimer(dtMs: number): void {
    if (this.ending || this.player.moveState === 'dying') return;
    this.timeLeft -= dtMs / 1000;
    this.registry.set('time', this.timeLeft);
    if (this.timeLeft <= RULES.TIME_HURRY && !this.hurryPlayed) {
      this.hurryPlayed = true;
      playSfx('damage');
      this.popText(this.player.x, this.player.y - 24, 'HURRY!');
    }
    if (this.timeLeft <= 0) {
      this.onPlayerDeath();
      this.player.die();
    }
  }

  /** Switch to the boss theme when the player enters the arena. */
  private updateBossMusic(): void {
    if (!this.boss || this.bossMusicOn || this.boss.dead) return;
    if (Math.abs(this.player.x - this.boss.x) < VIEW_W * 0.8) {
      this.bossMusicOn = true;
      chiptune.play(TRACKS.boss);
    }
  }
}
