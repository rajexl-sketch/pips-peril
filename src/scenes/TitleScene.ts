/**
 * Title screen: logo, demo backdrop, continue/new-game/settings menu,
 * and the high score. Starting input also unlocks the AudioContext.
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { saves } from '../systems/SaveSystem';
import { gameState } from '../systems/GameState';
import { chiptune } from '../audio/Chiptune';
import { TRACKS } from '../audio/tracks';
import { Menu } from './ui/Menu';

export class TitleScene extends Phaser.Scene {
  private menu!: Menu;

  constructor() {
    super('Title');
  }

  create(): void {
    this.add.tileSprite(0, 0, VIEW_W, VIEW_H, 'bg-grass').setOrigin(0);

    // Logo panel
    const panel = this.add.rectangle(VIEW_W / 2, 64, 200, 56, 0x101030, 0.85);
    panel.setStrokeStyle(2, 0xf0c020);
    this.add.bitmapText(VIEW_W / 2, 48, FONT_KEY, "PIP'S PERIL").setOrigin(0.5).setScale(2).setTint(0xf0c020);
    this.add.bitmapText(VIEW_W / 2, 72, FONT_KEY, 'AN 8-BIT ADVENTURE').setOrigin(0.5).setTint(0xa8c8f8);

    // Decorative hero
    this.add.image(40, 196, 'pip-b-run0').setScale(2);
    this.add.image(216, 198, 'bloop-0').setScale(2).setFlipX(true);

    const save = saves.get();
    const hasProgress = save.unlockedWorld > 1 || save.unlockedStage > 1;

    const items = [];
    if (hasProgress) {
      items.push({
        label: () => `CONTINUE ${save.unlockedWorld}-${save.unlockedStage}`,
        onSelect: () => this.startGame(save.unlockedWorld, save.unlockedStage)
      });
    }
    items.push(
      { label: () => 'NEW GAME', onSelect: () => this.startGame(1, 1) },
      { label: () => 'SETTINGS', onSelect: () => this.scene.start('Settings', { from: 'Title' }) }
    );

    this.menu = new Menu(this, VIEW_W / 2 - 40, 124, items);
    this.menu.bindKeys();

    this.add
      .bitmapText(VIEW_W / 2, 180, FONT_KEY, `HIGH SCORE ${String(save.highScore).padStart(6, '0')}`)
      .setOrigin(0.5)
      .setTint(0xf8f8f8);
    this.add
      .bitmapText(VIEW_W / 2, 218, FONT_KEY, 'ARROWS MOVE  Z JUMP  X RUN')
      .setOrigin(0.5)
      .setTint(0x88a8c8);
    this.add
      .bitmapText(VIEW_W / 2, 231, FONT_KEY, '(C) 2026 RAJEXL-SKETCH')
      .setOrigin(0.5)
      .setTint(0x6080a0);

    // Music starts on first interaction (browser autoplay policy).
    this.input.once('pointerdown', () => this.startMusic());
    this.input.keyboard?.once('keydown', () => this.startMusic());
  }

  private startMusic(): void {
    chiptune.ensureContext();
    chiptune.play(TRACKS.title);
  }

  private startGame(world: number, stage: number): void {
    chiptune.ensureContext();
    chiptune.stop();
    gameState.newRun(world, stage);
    this.scene.start('LevelIntro');
  }
}
