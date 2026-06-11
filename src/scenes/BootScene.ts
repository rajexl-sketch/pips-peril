/**
 * Boot: generates every texture, animation, and the bitmap font, then
 * applies saved audio settings and moves to the title screen.
 */
import Phaser from 'phaser';
import { buildAllTextures } from '../gfx/TextureFactory';
import { buildFont } from '../gfx/font';
import { chiptune } from '../audio/Chiptune';
import { saves } from '../systems/SaveSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    buildAllTextures(this);
    buildFont(this);
    const s = saves.get().settings;
    chiptune.musicVolume = s.musicVolume;
    chiptune.sfxVolume = s.sfxVolume;
    this.scene.start('Title');
  }
}
