/**
 * HUD overlay scene: score / coins / world / time / lives / gems, boss HP,
 * plus on-screen touch controls on mobile. Runs in parallel with GameScene.
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H, DEPTH } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { gameState } from '../systems/GameState';
import { saves } from '../systems/SaveSystem';
import { virtualPad } from '../systems/InputManager';

export class UIScene extends Phaser.Scene {
  private score!: Phaser.GameObjects.BitmapText;
  private coins!: Phaser.GameObjects.BitmapText;
  private world!: Phaser.GameObjects.BitmapText;
  private timeText!: Phaser.GameObjects.BitmapText;
  private lives!: Phaser.GameObjects.BitmapText;
  private gems: Phaser.GameObjects.Image[] = [];
  private bossBar!: Phaser.GameObjects.Rectangle;
  private bossBarBg!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('UI');
  }

  create(): void {
    if (saves.get().settings.highContrast) {
      this.add.rectangle(VIEW_W / 2, 12, VIEW_W, 24, 0x000000, 0.85).setDepth(DEPTH.HUD - 1);
    }

    const mk = (x: number, y: number, text: string) =>
      this.add.bitmapText(x, y, FONT_KEY, text).setDepth(DEPTH.HUD);

    mk(8, 4, 'PIP');
    this.score = mk(8, 13, '000000');
    this.add.image(78, 16, 'coin-0').setScale(0.5).setDepth(DEPTH.HUD);
    this.coins = mk(86, 13, '*00');
    mk(120, 4, 'WORLD');
    this.world = mk(126, 13, '1-1');
    mk(166, 4, 'TIME');
    this.timeText = mk(170, 13, '300');
    this.add.image(204, 16, 'pip-s-idle').setScale(0.55).setDepth(DEPTH.HUD);
    this.lives = mk(212, 13, '*3');

    for (let i = 0; i < 3; i++) {
      this.gems.push(
        this.add.image(236 + i * 7, 16, 'gem').setScale(0.4).setDepth(DEPTH.HUD).setAlpha(0.25)
      );
    }

    // Boss HP bar (hidden unless GameScene sets registry 'bossHp')
    this.bossBarBg = this.add
      .rectangle(VIEW_W / 2, VIEW_H - 14, 104, 8, 0x000000, 0.7)
      .setDepth(DEPTH.HUD)
      .setVisible(false);
    this.bossBar = this.add
      .rectangle(VIEW_W / 2 - 50, VIEW_H - 14, 100, 4, 0xd83828)
      .setOrigin(0, 0.5)
      .setDepth(DEPTH.HUD)
      .setVisible(false);

    if (this.sys.game.device.input.touch) this.buildTouchControls();
  }

  update(): void {
    this.score.setText(String(gameState.score).padStart(6, '0'));
    this.coins.setText(`*${String(gameState.coins).padStart(2, '0')}`);
    this.world.setText(`${gameState.world}-${gameState.stage}`);
    this.lives.setText(`*${gameState.lives}`);

    const t = this.registry.get('time') as number | undefined;
    if (t !== undefined) {
      this.timeText.setText(String(Math.max(0, Math.ceil(t))).padStart(3, '0'));
      this.timeText.setTint(t < 60 ? 0xd83828 : 0xffffff);
    }

    const collected = saves.gemsFor(gameState.world, gameState.stage);
    for (let i = 0; i < 3; i++) this.gems[i].setAlpha(collected[i] ? 1 : 0.25);

    const bossHp = this.registry.get('bossHp') as [number, number] | undefined;
    const showBoss = !!bossHp && bossHp[0] > 0;
    this.bossBar.setVisible(showBoss);
    this.bossBarBg.setVisible(showBoss);
    if (bossHp) this.bossBar.width = Math.max(0, (bossHp[0] / bossHp[1]) * 100);
  }

  /** Semi-transparent D-pad + A/B buttons for touch play. */
  private buildTouchControls(): void {
    const mkBtn = (
      x: number, y: number, r: number, label: string,
      action: keyof typeof virtualPad
    ) => {
      const zone = this.add
        .circle(x, y, r, 0xffffff, 0.15)
        .setDepth(DEPTH.HUD)
        .setStrokeStyle(1, 0xffffff, 0.4)
        .setInteractive();
      this.add.bitmapText(x, y - 3, FONT_KEY, label).setOrigin(0.5).setDepth(DEPTH.HUD).setAlpha(0.6);
      zone.on('pointerdown', () => (virtualPad[action] = true));
      zone.on('pointerover', (p: Phaser.Input.Pointer) => {
        if (p.isDown) virtualPad[action] = true;
      });
      zone.on('pointerup', () => (virtualPad[action] = false));
      zone.on('pointerout', () => (virtualPad[action] = false));
    };

    mkBtn(24, VIEW_H - 38, 16, 'L', 'left');
    mkBtn(62, VIEW_H - 38, 16, 'R', 'right');
    mkBtn(43, VIEW_H - 64, 13, 'U', 'up');
    mkBtn(43, VIEW_H - 16, 13, 'D', 'down');
    mkBtn(VIEW_W - 24, VIEW_H - 44, 17, 'A', 'jump');
    mkBtn(VIEW_W - 60, VIEW_H - 28, 14, 'B', 'run');
    mkBtn(VIEW_W - 16, 34, 9, 'P', 'pause');
  }
}
