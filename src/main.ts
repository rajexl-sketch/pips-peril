/**
 * Pip's Peril — entry point.
 * NES-native internal resolution (256x240), integer-scaled with crisp pixels.
 */
import Phaser from 'phaser';
import { VIEW_W, VIEW_H, PHYS } from './core/constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { LevelIntroScene } from './scenes/LevelIntroScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { PauseScene } from './scenes/PauseScene';
import { SettingsScene } from './scenes/SettingsScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW_W,
  height: VIEW_H,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: Phaser.Scale.MAX_ZOOM
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: PHYS.GRAVITY },
      tileBias: 12,
      debug: false
    }
  },
  input: {
    gamepad: true,
    activePointers: 4 // multi-touch for on-screen controls
  },
  fps: { target: 60 },
  scene: [
    BootScene,
    TitleScene,
    LevelIntroScene,
    GameScene,
    UIScene,
    PauseScene,
    SettingsScene,
    GameOverScene,
    VictoryScene
  ]
});

// Exposed for debugging and automated smoke tests.
declare global {
  interface Window {
    __game: Phaser.Game;
  }
}
window.__game = game;

// Vite HMR: tear down the old game instance instead of stacking new ones.
if (import.meta.hot) {
  import.meta.hot.dispose(() => game.destroy(true));
}
