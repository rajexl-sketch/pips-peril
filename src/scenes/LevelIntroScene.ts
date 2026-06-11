/**
 * Classic black interstitial card: "WORLD x-y", world name, lives count.
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { gameState } from '../systems/GameState';
import { WORLD_NAMES } from '../levels/levels';
import { chiptune } from '../audio/Chiptune';

export class LevelIntroScene extends Phaser.Scene {
  constructor() {
    super('LevelIntro');
  }

  create(): void {
    chiptune.stop();
    this.cameras.main.setBackgroundColor('#000000');
    this.add
      .bitmapText(VIEW_W / 2, 80, FONT_KEY, `WORLD ${gameState.world}-${gameState.stage}`)
      .setOrigin(0.5)
      .setScale(1.5);
    this.add
      .bitmapText(VIEW_W / 2, 104, FONT_KEY, WORLD_NAMES[gameState.world - 1])
      .setOrigin(0.5)
      .setTint(0xf0c020);

    this.add.image(VIEW_W / 2 - 20, 140, 'pip-s-idle');
    this.add
      .bitmapText(VIEW_W / 2 + 2, 136, FONT_KEY, `* ${gameState.lives}`)
      .setOrigin(0, 0.5);

    this.time.delayedCall(1600, () => this.scene.start('Game'));
  }
}
