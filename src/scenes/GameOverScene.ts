/**
 * Game over / continue screen. Continue restarts the current world at
 * stage 1 with fresh lives (classic continue rules); quit returns to title.
 */
import Phaser from 'phaser';
import { VIEW_W } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { gameState } from '../systems/GameState';
import { saves } from '../systems/SaveSystem';
import { chiptune } from '../audio/Chiptune';
import { Menu } from './ui/Menu';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(): void {
    chiptune.stop();
    this.cameras.main.setBackgroundColor('#000000');
    this.add.bitmapText(VIEW_W / 2, 70, FONT_KEY, 'GAME OVER').setOrigin(0.5).setScale(2).setTint(0xd83828);

    const newBest = saves.submitScore(gameState.score);
    this.add
      .bitmapText(
        VIEW_W / 2, 104, FONT_KEY,
        `SCORE ${String(gameState.score).padStart(6, '0')}${newBest ? '  NEW BEST!' : ''}`
      )
      .setOrigin(0.5)
      .setTint(newBest ? 0xf0c020 : 0xffffff);

    const menu = new Menu(this, VIEW_W / 2 - 36, 140, [
      {
        label: () => 'CONTINUE',
        onSelect: () => {
          const world = gameState.world;
          gameState.newRun(world, 1);
          this.scene.start('LevelIntro');
        }
      },
      { label: () => 'TITLE', onSelect: () => this.scene.start('Title') }
    ]);
    menu.bindKeys();
  }
}
