/**
 * Tiny reusable menu widget: bitmap-text rows with a '>' cursor, driven by
 * keyboard / gamepad / touch taps. Used by Title, Pause, Settings, GameOver.
 */
import Phaser from 'phaser';
import { FONT_KEY } from '../../gfx/font';
import { playSfx } from '../../audio/Sfx';

export interface MenuItem {
  label: () => string;
  onSelect?: () => void;
  /** Left/right adjust handler (for sliders/toggles). */
  onAdjust?: (dir: -1 | 1) => void;
}

export class Menu {
  private texts: Phaser.GameObjects.BitmapText[] = [];
  private cursor: Phaser.GameObjects.BitmapText;
  index = 0;
  enabled = true;

  constructor(
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    private items: MenuItem[],
    private lineHeight = 14
  ) {
    for (let i = 0; i < items.length; i++) {
      const t = scene.add
        .bitmapText(x, y + i * lineHeight, FONT_KEY, items[i].label())
        .setDepth(30);
      t.setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => {
        if (!this.enabled) return;
        this.index = i;
        this.refresh();
        this.select();
      });
      this.texts.push(t);
    }
    this.cursor = scene.add.bitmapText(x - 12, y, FONT_KEY, '>').setDepth(30);
    this.refresh();
  }

  refresh(): void {
    for (let i = 0; i < this.items.length; i++) {
      this.texts[i].setText(this.items[i].label());
      this.texts[i].setTint(i === this.index ? 0xffffff : 0x9090a0);
    }
    this.cursor.y = this.y + this.index * this.lineHeight;
  }

  move(dir: -1 | 1): void {
    if (!this.enabled) return;
    this.index = (this.index + dir + this.items.length) % this.items.length;
    playSfx('select');
    this.refresh();
  }

  adjust(dir: -1 | 1): void {
    if (!this.enabled) return;
    const item = this.items[this.index];
    if (item.onAdjust) {
      item.onAdjust(dir);
      playSfx('select');
      this.refresh();
    }
  }

  select(): void {
    if (!this.enabled) return;
    const item = this.items[this.index];
    if (item.onSelect) {
      playSfx('coin');
      item.onSelect();
    } else if (item.onAdjust) {
      item.onAdjust(1);
      this.refresh();
    }
  }

  /** Wire standard keys: up/down/left/right/enter/space/z. */
  bindKeys(): void {
    const kb = this.scene.input.keyboard;
    if (!kb) return;
    kb.on('keydown-UP', () => this.move(-1));
    kb.on('keydown-DOWN', () => this.move(1));
    kb.on('keydown-LEFT', () => this.adjust(-1));
    kb.on('keydown-RIGHT', () => this.adjust(1));
    kb.on('keydown-ENTER', () => this.select());
    kb.on('keydown-SPACE', () => this.select());
    kb.on('keydown-Z', () => this.select());
  }

  destroy(): void {
    this.texts.forEach((t) => t.destroy());
    this.cursor.destroy();
  }
}
