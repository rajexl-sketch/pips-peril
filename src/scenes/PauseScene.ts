/**
 * Pause overlay launched on top of GameScene (which is paused underneath).
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { chiptune } from '../audio/Chiptune';
import { playSfx } from '../audio/Sfx';
import { Menu } from './ui/Menu';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('Pause');
  }

  create(): void {
    playSfx('pause');
    this.add.rectangle(VIEW_W / 2, VIEW_H / 2, VIEW_W, VIEW_H, 0x000000, 0.6);
    this.add.rectangle(VIEW_W / 2, VIEW_H / 2, 150, 110, 0x101030, 0.95).setStrokeStyle(2, 0xf0c020);
    this.add.bitmapText(VIEW_W / 2, 80, FONT_KEY, 'PAUSED').setOrigin(0.5).setScale(1.5);

    const menu = new Menu(this, VIEW_W / 2 - 40, 104, [
      { label: () => 'RESUME', onSelect: () => this.resumeGame() },
      { label: () => 'SETTINGS', onSelect: () => this.scene.start('Settings', { from: 'Pause' }) },
      {
        label: () => 'QUIT TO TITLE',
        onSelect: () => {
          chiptune.stop();
          this.scene.stop('Game');
          this.scene.stop('UI');
          this.scene.start('Title');
        }
      }
    ]);
    menu.bindKeys();

    this.input.keyboard?.on('keydown-ESC', () => this.resumeGame());
  }

  private resumeGame(): void {
    playSfx('pause');
    this.scene.resume('Game');
    this.scene.stop();
  }
}
