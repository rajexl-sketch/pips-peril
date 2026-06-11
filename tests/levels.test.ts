import { describe, it, expect } from 'vitest';
import { CHUNKS, assembleRows } from '../src/levels/chunks';
import {
  parseLevel, warpLanding, areaAt, TILE_IDX, ROWS
} from '../src/levels/LevelBuilder';
import { getLevel } from '../src/levels/levels';

describe('chunk library', () => {
  it('every chunk has exactly 15 rows', () => {
    for (const [name, rows] of Object.entries(CHUNKS)) {
      expect(rows.length, `chunk ${name}`).toBe(ROWS);
    }
  });

  it('assembles chunks side by side with padding', () => {
    const rows = assembleRows(['START', 'GOAL']);
    expect(rows).toHaveLength(ROWS);
    const width = rows[0].length;
    for (const r of rows) expect(r.length).toBe(width);
  });

  it('rejects unknown chunk names', () => {
    expect(() => assembleRows(['NOT_A_CHUNK'])).toThrow(/Unknown chunk/);
  });
});

describe('parseLevel', () => {
  const def = getLevel(1, 1);
  const parsed = parseLevel(def);

  it('produces a rectangular grid', () => {
    expect(parsed.grid).toHaveLength(ROWS);
    const w = parsed.grid[0].length;
    for (const row of parsed.grid) expect(row.length).toBe(w);
  });

  it('contains a spawn and a goal', () => {
    expect(parsed.placements.some((p) => p.type === 'spawn')).toBe(true);
    expect(parsed.placements.some((p) => p.type === 'flag')).toBe(true);
  });

  it('maps ground rows to solid tiles', () => {
    // START chunk: bottom two rows are ground.
    expect(parsed.grid[14][0]).toBe(TILE_IDX.GROUND);
    expect(parsed.grid[13][0]).toBe(TILE_IDX.GROUND);
    expect(parsed.grid[0][0]).toBe(TILE_IDX.EMPTY);
  });

  it('numbers warp markers in author order', () => {
    const warpLevel = parseLevel(getLevel(1, 2)); // contains the warp room
    const pipes = warpLevel.placements.filter((p) => p.type === 'warp-pipe');
    expect(pipes.length).toBe(4); // 1 secret entrance + 3 warp room pipes
    expect(pipes.map((p) => p.meta?.warpIndex)).toEqual([0, 1, 2, 3]);
    expect(warpLevel.warps).toHaveLength(4);
    expect(warpLevel.warps[1].toLevel).toBe('2-1');
  });

  it('locates warp landings in the target area', () => {
    const warpLevel = parseLevel(getLevel(1, 2));
    const land = warpLanding(warpLevel, { toArea: 'warp' });
    const warpArea = warpLevel.areas.find((a) => a.name === 'warp')!;
    expect(land.tx).toBeGreaterThanOrEqual(warpArea.startX);
    expect(land.tx).toBeLessThan(warpArea.startX + warpArea.widthTiles);
    expect(areaAt(warpLevel, land.tx).name).toBe('warp');
  });

  it('limits gems to 3 per level', () => {
    for (let w = 1; w <= 8; w++) {
      for (let s = 1; s <= 4; s++) {
        const lvl = parseLevel(getLevel(w, s));
        const gems = lvl.placements.filter((p) => p.type === 'gem');
        expect(gems.length, `level ${w}-${s}`).toBeLessThanOrEqual(3);
      }
    }
  });
});

describe('all 32 levels', () => {
  it('parse without errors and are completable (spawn + exit present)', () => {
    for (let w = 1; w <= 8; w++) {
      for (let s = 1; s <= 4; s++) {
        const parsed = parseLevel(getLevel(w, s));
        const label = `level ${w}-${s}`;
        expect(parsed.widthTiles, label).toBeGreaterThan(40);
        expect(
          parsed.placements.some((p) => p.type === 'spawn' && p.area === 'main'),
          `${label} spawn`
        ).toBe(true);
        const hasExit = parsed.placements.some(
          (p) => p.type === 'flag' || p.type === 'lockeddoor'
        );
        expect(hasExit, `${label} exit`).toBe(true);
      }
    }
  });

  it('boss stages have a boss and a locked door', () => {
    for (let w = 1; w <= 8; w++) {
      const parsed = parseLevel(getLevel(w, 4));
      expect(
        parsed.placements.some((p) => p.type === 'enemy' && p.meta?.kind === 'boss'),
        `world ${w} boss`
      ).toBe(true);
      expect(
        parsed.placements.some((p) => p.type === 'lockeddoor'),
        `world ${w} arena door`
      ).toBe(true);
    }
  });

  it('key-quest levels contain their key', () => {
    for (const [w, s] of [[7, 3], [8, 3]] as const) {
      const parsed = parseLevel(getLevel(w, s));
      expect(parsed.def.needsKey).toBe(true);
      expect(parsed.placements.some((p) => p.type === 'key'), `level ${w}-${s}`).toBe(true);
    }
  });
});
