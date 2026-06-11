/**
 * Level parser: turns a LevelDef (ASCII areas assembled from chunks) into
 * tile-index grids plus a list of object placements.
 *
 * Pure TypeScript with no Phaser dependency so it can be unit tested in
 * Node. GameScene consumes the result to build the actual tilemap/sprites.
 */
import { assembleRows } from './chunks';
import type { ThemeName } from '../gfx/TextureFactory';

export const ROWS = 15;

/** Tile indices in the generated tileset strip (see GameScene.buildTileset). */
export const TILE_IDX = {
  GROUND: 0,
  BLOCK: 1,
  PIPE_TL: 2,
  PIPE_TR: 3,
  PIPE_BL: 4,
  PIPE_BR: 5,
  PLATFORM: 6,
  BRIDGE: 7,
  LADDER: 8,
  WATER_TOP: 9,
  WATER_FILL: 10,
  LAVA_TOP: 11,
  LAVA_FILL: 12,
  EMPTY: -1
} as const;

export const SOLID_TILES = [
  TILE_IDX.GROUND,
  TILE_IDX.BLOCK,
  TILE_IDX.PIPE_TL,
  TILE_IDX.PIPE_TR,
  TILE_IDX.PIPE_BL,
  TILE_IDX.PIPE_BR
];

export const ONEWAY_TILES = [TILE_IDX.PLATFORM, TILE_IDX.BRIDGE];

export type PlacementType =
  | 'spawn'
  | 'brick'
  | 'question' // meta.content: 'coin' | 'power' | 'oneup'
  | 'hidden' // invisible block, meta.content: 'coin'
  | 'coin'
  | 'gem' // meta.index: 0..2
  | 'spring'
  | 'spike'
  | 'checkpoint'
  | 'flag'
  | 'mplatform' // meta.axis: 'x' | 'y'
  | 'fplatform'
  | 'key'
  | 'door' // meta.warpIndex
  | 'lockeddoor'
  | 'warp-pipe' // meta.warpIndex — trigger zone on a pipe top
  | 'landing' // meta.index — warp arrival points, per area
  | 'item' // meta.kind: 'bubble' | 'boots' | 'feather'
  | 'enemy'; // meta.kind: bloop|bloopE|flit|sheldon|springle|rammet|spitterbud|boss

export interface Placement {
  type: PlacementType;
  /** Tile coordinates in the combined grid. */
  tx: number;
  ty: number;
  area: string;
  meta?: Record<string, unknown>;
}

export interface AreaDef {
  chunks: string[];
  theme?: ThemeName;
}

export interface WarpDef {
  /** Target area name ('main' or a sub-area). */
  toArea?: string;
  /** Landing marker index within the target area (default: spawn/'@'). */
  marker?: number;
  /** Or: jump to a different level entirely, e.g. '3-1' (warp zones). */
  toLevel?: string;
}

export interface LevelDef {
  theme: ThemeName;
  time: number;
  main: AreaDef;
  subs?: Record<string, AreaDef>;
  /** Consumed by W/D markers: main area first, then subs in order. */
  warps?: WarpDef[];
  /** The locked exit door requires the key item (vs. boss defeat). */
  needsKey?: boolean;
  boss?: boolean;
}

export interface BuiltArea {
  name: string;
  theme: ThemeName;
  /** Tile-space bounds within the combined grid. */
  startX: number;
  widthTiles: number;
}

export interface ParsedLevel {
  /** Combined tile-index grid, ROWS x totalWidth. */
  grid: number[][];
  placements: Placement[];
  areas: BuiltArea[];
  widthTiles: number;
  warps: WarpDef[];
  def: LevelDef;
}

const AREA_GAP = 6; // empty columns separating areas in the combined grid

export function parseLevel(def: LevelDef): ParsedLevel {
  const grid: number[][] = Array.from({ length: ROWS }, () => []);
  const placements: Placement[] = [];
  const areas: BuiltArea[] = [];
  let warpIndex = 0;
  let gemIndex = 0; // level-global: max 3 gems across all areas
  let cursor = 0;

  const areaList: [string, AreaDef][] = [['main', def.main]];
  for (const [name, sub] of Object.entries(def.subs ?? {})) areaList.push([name, sub]);

  for (const [name, areaDef] of areaList) {
    const rows = assembleRows(areaDef.chunks);
    const width = Math.max(...rows.map((r) => r.length));
    areas.push({
      name,
      theme: areaDef.theme ?? def.theme,
      startX: cursor,
      widthTiles: width
    });

    let landingIndex = 0;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < width; x++) {
        const ch = rows[y][x] ?? '.';
        const tx = cursor + x;
        let tile: number = TILE_IDX.EMPTY;
        const place = (type: PlacementType, meta?: Record<string, unknown>) =>
          placements.push({ type, tx, ty: y, area: name, meta });

        switch (ch) {
          case '#': tile = TILE_IDX.GROUND; break;
          case 'M': tile = TILE_IDX.BLOCK; break;
          case '(': tile = TILE_IDX.PIPE_TL; break;
          case ')': tile = TILE_IDX.PIPE_TR; break;
          case '[': tile = TILE_IDX.PIPE_BL; break;
          case ']': tile = TILE_IDX.PIPE_BR; break;
          case '=': tile = TILE_IDX.PLATFORM; break;
          case '+': tile = TILE_IDX.BRIDGE; break;
          case 'H': tile = TILE_IDX.LADDER; break;
          case 'w':
            tile = rows[y - 1]?.[x] === 'w' ? TILE_IDX.WATER_FILL : TILE_IDX.WATER_TOP;
            break;
          case 'l':
            tile = rows[y - 1]?.[x] === 'l' ? TILE_IDX.LAVA_FILL : TILE_IDX.LAVA_TOP;
            break;
          case 'W':
            tile = TILE_IDX.PIPE_TL;
            place('warp-pipe', { warpIndex: warpIndex++ });
            break;
          case '@': place('spawn'); break;
          case 'Z': place('landing', { index: landingIndex++ }); break;
          case 'B': place('brick'); break;
          case '?': place('question', { content: 'coin' }); break;
          case 'P': place('question', { content: 'power' }); break;
          case '1': place('question', { content: 'oneup' }); break;
          case 'h': place('hidden', { content: 'coin' }); break;
          case 'c': place('coin'); break;
          case 'g':
            if (gemIndex < 3) place('gem', { index: gemIndex++ });
            else place('coin'); // overflow gems degrade gracefully to coins
            break;
          case 'S': place('spring'); break;
          case '^': place('spike'); break;
          case '*': place('checkpoint'); break;
          case 'F': place('flag'); break;
          case 'm': place('mplatform', { axis: 'x' }); break;
          case 'v': place('mplatform', { axis: 'y' }); break;
          case '_': place('fplatform'); break;
          case 'y': place('key'); break;
          case 'D': place('door', { warpIndex: warpIndex++ }); break;
          case 'L': place('lockeddoor'); break;
          case 'U': place('item', { kind: 'bubble' }); break;
          case 'O': place('item', { kind: 'boots' }); break;
          case 'A': place('item', { kind: 'feather' }); break;
          case 'e': place('enemy', { kind: 'bloop' }); break;
          case 'E': place('enemy', { kind: 'bloopE' }); break;
          case 'f': place('enemy', { kind: 'flit' }); break;
          case 's': place('enemy', { kind: 'sheldon' }); break;
          case 'j': place('enemy', { kind: 'springle' }); break;
          case 'r': place('enemy', { kind: 'rammet' }); break;
          case 'p': place('enemy', { kind: 'spitterbud' }); break;
          case 'K': place('enemy', { kind: 'boss' }); break;
          case '.': case ' ': break;
          default: break; // unknown chars are ignored, not fatal
        }
        grid[y][tx] = tile;
      }
    }

    // Gap columns between areas
    for (let y = 0; y < ROWS; y++) {
      for (let g = 0; g < AREA_GAP; g++) grid[y][cursor + width + g] = TILE_IDX.EMPTY;
    }
    cursor += width + AREA_GAP;
  }

  const widthTiles = cursor - AREA_GAP;
  return { grid, placements, areas, widthTiles, warps: def.warps ?? [], def };
}

/** Find the area containing a tile x coordinate. */
export function areaAt(parsed: ParsedLevel, tx: number): BuiltArea {
  for (const a of parsed.areas) {
    if (tx >= a.startX && tx < a.startX + a.widthTiles) return a;
  }
  return parsed.areas[0];
}

/** Locate a warp's landing position (tile coords) in the parsed level. */
export function warpLanding(parsed: ParsedLevel, warp: WarpDef): { tx: number; ty: number } {
  const targetArea = warp.toArea ?? 'main';
  const markerIdx = warp.marker ?? -1;
  let fallback: Placement | null = null;
  for (const p of parsed.placements) {
    if (p.area !== targetArea) continue;
    if (markerIdx >= 0 && p.type === 'landing' && p.meta?.index === markerIdx) {
      return { tx: p.tx, ty: p.ty };
    }
    if (p.type === 'spawn' && !fallback) fallback = p;
    if (markerIdx < 0 && p.type === 'landing' && !fallback) fallback = p;
  }
  if (fallback) return { tx: fallback.tx, ty: fallback.ty };
  const area = parsed.areas.find((a) => a.name === targetArea) ?? parsed.areas[0];
  return { tx: area.startX + 2, ty: 12 };
}
