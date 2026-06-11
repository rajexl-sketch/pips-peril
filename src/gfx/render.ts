/**
 * Pixel-grid renderer: turns ASCII art grids into Phaser canvas textures.
 *
 * Every sprite in the game is defined as an array of strings where each
 * character maps to a palette color ('.' = transparent). This keeps all
 * art 100% original, diff-able, and palette-swappable per world theme.
 */
import Phaser from 'phaser';

export type Palette = Record<string, string>;

/** Render a single grid into a texture (skips if the key already exists). */
export function renderGrid(
  scene: Phaser.Scene,
  key: string,
  grid: string[],
  palette: Palette
): void {
  if (scene.textures.exists(key)) return;
  const h = grid.length;
  const w = grid[0].length;
  const tex = scene.textures.createCanvas(key, w, h);
  if (!tex) return;
  const ctx = tex.getContext();
  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  tex.refresh();
}

/** Render a set of frames (key suffixed -0, -1, ...) sharing one palette. */
export function renderFrames(
  scene: Phaser.Scene,
  baseKey: string,
  frames: string[][],
  palette: Palette
): void {
  frames.forEach((grid, i) => renderGrid(scene, `${baseKey}-${i}`, grid, palette));
}

/** Horizontally mirror a grid (for asymmetric frames where flipX is wrong). */
export function mirror(grid: string[]): string[] {
  return grid.map((row) => row.split('').reverse().join(''));
}
