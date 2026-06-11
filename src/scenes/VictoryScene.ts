/**
 * Ending: shown after defeating King Grum in world 8-4.
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { gameState } from '../systems/GameState';
import { saves } from '../systems/SaveSystem';
import { chiptune } from '../audio/Chiptune';
import { TRACKS } from '../audio/tracks';
import { Menu } from './ui/Menu';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('Victory');
  }

  create(): void {
    chiptune.play(TRACKS.victory);
    this.add.tileSprite(0, 0, VIEW_W, VIEW_H, 'bg-grass').setOrigin(0);
    this.add.rectangle(VIEW_W / 2, VIEW_H / 2, 220, 150, 0x101030, 0.9).setStrokeStyle(2, 0xf0c020);

    this.add.bitmapText(VIEW_W / 2, 70, FONT_KEY, 'PERIL VANQUISHED!').setOrigin(0.5).setScale(1.5).setTint(0xf0c020);
    this.add.bitmapText(VIEW_W / 2, 96, FONT_KEY, 'KING GRUM HAS FALLEN AND').setOrigin(0.5);
    this.add.bitmapText(VIEW_W / 2, 108, FONT_KEY, 'THE EIGHT REALMS ARE FREE.').setOrigin(0.5);
    this.add.bitmapText(VIEW_W / 2, 120, FONT_KEY, 'THANK YOU, PIP!').setOrigin(0.5);

    this.add.image(VIEW_W / 2, 144, 'pip-b-idle').setScale(2);

    saves.submitScore(gameState.score);
    this.add
      .bitmapText(VIEW_W / 2, 170, FONT_KEY, `FINAL SCORE ${String(gameState.score).padStart(6, '0')}`)
      .setOrigin(0.5);

    const menu = new Menu(this, VIEW_W / 2 - 20, 190, [
      { label: () => 'TITLE', onSelect: () => this.scene.start('Title') }
    ]);
    menu.bindKeys();
  }
}
