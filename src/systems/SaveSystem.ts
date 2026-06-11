/**
 * Persistence layer: progress, settings, and high scores in localStorage.
 * Storage is injected so the module is unit-testable in Node.
 */
import { STORAGE_KEY, Diff } from '../core/constants';

export interface KeyBindings {
  left: string;
  right: string;
  up: string;
  down: string;
  jump: string;
  run: string;
  pause: string;
}

export const DEFAULT_BINDINGS: KeyBindings = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  up: 'ArrowUp',
  down: 'ArrowDown',
  jump: 'KeyZ',
  run: 'KeyX',
  pause: 'Enter'
};

export interface Settings {
  musicVolume: number;
  sfxVolume: number;
  difficulty: Diff;
  highContrast: boolean;
  bindings: KeyBindings;
}

export interface SaveData {
  version: number;
  /** Highest unlocked world/stage (1-based). */
  unlockedWorld: number;
  unlockedStage: number;
  /** Hidden gems collected, keyed by "world-stage" -> 3 booleans. */
  gems: Record<string, boolean[]>;
  highScore: number;
  settings: Settings;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function defaultSave(): SaveData {
  return {
    version: 1,
    unlockedWorld: 1,
    unlockedStage: 1,
    gems: {},
    highScore: 0,
    settings: {
      musicVolume: 0.6,
      sfxVolume: 0.8,
      difficulty: Diff.Normal,
      highContrast: false,
      bindings: { ...DEFAULT_BINDINGS }
    }
  };
}

export class SaveSystem {
  private data: SaveData;

  constructor(private storage: StorageLike | null = defaultStorage()) {
    this.data = this.load();
  }

  /** Re-read from storage (validates and migrates malformed data). */
  load(): SaveData {
    const fallback = defaultSave();
    if (!this.storage) return fallback;
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      if (typeof parsed !== 'object' || parsed === null || parsed.version !== 1) {
        return fallback;
      }
      // Deep-merge over defaults so missing fields never crash the game.
      const merged: SaveData = {
        ...fallback,
        ...parsed,
        gems: { ...(parsed.gems ?? {}) },
        settings: {
          ...fallback.settings,
          ...(parsed.settings ?? {}),
          bindings: { ...DEFAULT_BINDINGS, ...(parsed.settings?.bindings ?? {}) }
        }
      };
      merged.unlockedWorld = clampInt(merged.unlockedWorld, 1, 8);
      merged.unlockedStage = clampInt(merged.unlockedStage, 1, 4);
      this.data = merged;
      return merged;
    } catch {
      return fallback;
    }
  }

  save(): void {
    try {
      this.storage?.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      /* storage full / private mode — play on without persistence */
    }
  }

  get(): SaveData {
    return this.data;
  }

  /** Record that a stage was beaten; unlocks the next one. */
  completeStage(world: number, stage: number): void {
    let nw = world;
    let ns = stage + 1;
    if (ns > 4) {
      ns = 1;
      nw = Math.min(world + 1, 8);
      if (world >= 8) ns = 4; // game beaten — stay on final stage
    }
    // Only advance, never regress.
    if (nw > this.data.unlockedWorld ||
        (nw === this.data.unlockedWorld && ns > this.data.unlockedStage)) {
      this.data.unlockedWorld = nw;
      this.data.unlockedStage = ns;
    }
    this.save();
  }

  collectGem(world: number, stage: number, index: number): void {
    const key = `${world}-${stage}`;
    const arr = this.data.gems[key] ?? [false, false, false];
    arr[index] = true;
    this.data.gems[key] = arr;
    this.save();
  }

  gemsFor(world: number, stage: number): boolean[] {
    return this.data.gems[`${world}-${stage}`] ?? [false, false, false];
  }

  submitScore(score: number): boolean {
    if (score > this.data.highScore) {
      this.data.highScore = score;
      this.save();
      return true;
    }
    return false;
  }

  updateSettings(patch: Partial<Settings>): void {
    this.data.settings = {
      ...this.data.settings,
      ...patch,
      bindings: { ...this.data.settings.bindings, ...(patch.bindings ?? {}) }
    };
    this.save();
  }

  reset(): void {
    this.data = defaultSave();
    try {
      this.storage?.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

function clampInt(v: unknown, lo: number, hi: number): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.floor(v) : lo;
  return Math.max(lo, Math.min(hi, n));
}

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

/** Shared instance for the running game. */
export const saves = new SaveSystem();
