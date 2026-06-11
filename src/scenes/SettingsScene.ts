/**
 * Settings: audio volumes, difficulty, high-contrast mode, key remapping,
 * and save-data reset. Reachable from both Title and Pause.
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H, Diff } from '../core/constants';
import { FONT_KEY } from '../gfx/font';
import { saves, KeyBindings } from '../systems/SaveSystem';
import { chiptune } from '../audio/Chiptune';
import { playSfx } from '../audio/Sfx';
import { codeLabel } from '../systems/InputManager';
import { Menu } from './ui/Menu';

const DIFF_NAMES = ['EASY', 'NORMAL', 'HARD'];
const REMAP_ACTIONS: (keyof KeyBindings)[] = ['left', 'right', 'up', 'down', 'jump', 'run', 'pause'];

export class SettingsScene extends Phaser.Scene {
  private from = 'Title';
  private menu!: Menu;
  private remapping: keyof KeyBindings | null = null;
  private hint!: Phaser.GameObjects.BitmapText;

  constructor() {
    super('Settings');
  }

  init(data: { from?: string }): void {
    this.from = data.from ?? 'Title';
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#101020');
    this.add.bitmapText(VIEW_W / 2, 18, FONT_KEY, 'SETTINGS').setOrigin(0.5).setScale(1.5).setTint(0xf0c020);

    const s = () => saves.get().settings;
    const vol = (v: number) => '*'.repeat(Math.round(v * 8)).padEnd(8, '-');

    const items = [
      {
        label: () => `MUSIC  ${vol(s().musicVolume)}`,
        onAdjust: (d: -1 | 1) => {
          const v = Phaser.Math.Clamp(s().musicVolume + d * 0.125, 0, 1);
          saves.updateSettings({ musicVolume: v });
          chiptune.setMusicVolume(v);
        }
      },
      {
        label: () => `SOUND  ${vol(s().sfxVolume)}`,
        onAdjust: (d: -1 | 1) => {
          const v = Phaser.Math.Clamp(s().sfxVolume + d * 0.125, 0, 1);
          saves.updateSettings({ sfxVolume: v });
          chiptune.setSfxVolume(v);
          playSfx('coin');
        }
      },
      {
        label: () => `DIFFICULTY ${DIFF_NAMES[s().difficulty]}`,
        onAdjust: (d: -1 | 1) => {
          const v = Phaser.Math.Clamp(s().difficulty + d, Diff.Easy, Diff.Hard) as Diff;
          saves.updateSettings({ difficulty: v });
        }
      },
      {
        label: () => `HIGH CONTRAST ${s().highContrast ? 'ON' : 'OFF'}`,
        onAdjust: () => saves.updateSettings({ highContrast: !s().highContrast })
      },
      ...REMAP_ACTIONS.map((action) => ({
        label: () =>
          this.remapping === action
            ? `${action.toUpperCase()}: PRESS A KEY`
            : `${action.toUpperCase()}: ${codeLabel(s().bindings[action])}`,
        onSelect: () => this.beginRemap(action)
      })),
      {
        label: () => 'RESET SAVE DATA',
        onSelect: () => {
          saves.reset();
          playSfx('break');
          this.menu.refresh();
        }
      },
      { label: () => 'BACK', onSelect: () => this.goBack() }
    ];

    this.menu = new Menu(this, 56, 40, items, 13);
    this.menu.bindKeys();

    this.hint = this.add
      .bitmapText(VIEW_W / 2, VIEW_H - 12, FONT_KEY, 'LEFT/RIGHT ADJUST  ENTER SELECT  ESC BACK')
      .setOrigin(0.5)
      .setTint(0x88a8c8);

    this.input.keyboard?.on('keydown-ESC', () => {
      if (!this.remapping) this.goBack();
    });

    // Raw DOM-level capture for remapping (we store KeyboardEvent.code).
    this.input.keyboard?.on('keydown', (ev: KeyboardEvent) => {
      if (!this.remapping) return;
      if (ev.code === 'Escape') {
        this.remapping = null;
        this.menu.enabled = true;
        this.menu.refresh();
        return;
      }
      const bindings = { ...saves.get().settings.bindings, [this.remapping]: ev.code };
      saves.updateSettings({ bindings });
      this.remapping = null;
      this.menu.enabled = true;
      playSfx('coin');
      this.menu.refresh();
      ev.stopPropagation();
    });
  }

  private beginRemap(action: keyof KeyBindings): void {
    this.remapping = action;
    this.menu.enabled = false;
    this.menu.refresh();
    this.hint.setText('PRESS THE NEW KEY  ESC CANCEL');
  }

  private goBack(): void {
    if (this.from === 'Pause') {
      this.scene.start('Pause');
    } else {
      this.scene.start('Title');
    }
  }
}
