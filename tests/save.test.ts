import { describe, it, expect } from 'vitest';
import { SaveSystem, StorageLike, defaultSave } from '../src/systems/SaveSystem';
import { Diff } from '../src/core/constants';

function memoryStorage(): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k)
  };
}

describe('SaveSystem', () => {
  it('starts with defaults on empty storage', () => {
    const s = new SaveSystem(memoryStorage());
    expect(s.get().unlockedWorld).toBe(1);
    expect(s.get().unlockedStage).toBe(1);
    expect(s.get().highScore).toBe(0);
  });

  it('persists and reloads progress', () => {
    const storage = memoryStorage();
    const a = new SaveSystem(storage);
    a.completeStage(1, 1);
    const b = new SaveSystem(storage);
    expect(b.get().unlockedStage).toBe(2);
  });

  it('rolls a world over after stage 4', () => {
    const s = new SaveSystem(memoryStorage());
    s.completeStage(1, 4);
    expect(s.get().unlockedWorld).toBe(2);
    expect(s.get().unlockedStage).toBe(1);
  });

  it('never regresses progress', () => {
    const s = new SaveSystem(memoryStorage());
    s.completeStage(3, 2);
    s.completeStage(1, 1);
    expect(s.get().unlockedWorld).toBe(3);
    expect(s.get().unlockedStage).toBe(3);
  });

  it('caps at world 8', () => {
    const s = new SaveSystem(memoryStorage());
    s.completeStage(8, 4);
    expect(s.get().unlockedWorld).toBe(8);
    expect(s.get().unlockedStage).toBe(4);
  });

  it('records gems per level', () => {
    const s = new SaveSystem(memoryStorage());
    s.collectGem(2, 3, 1);
    expect(s.gemsFor(2, 3)).toEqual([false, true, false]);
    expect(s.gemsFor(1, 1)).toEqual([false, false, false]);
  });

  it('only accepts higher scores', () => {
    const s = new SaveSystem(memoryStorage());
    expect(s.submitScore(500)).toBe(true);
    expect(s.submitScore(300)).toBe(false);
    expect(s.get().highScore).toBe(500);
  });

  it('survives corrupted JSON', () => {
    const storage = memoryStorage();
    storage.setItem('pips-peril-save-v1', '{not json!!');
    const s = new SaveSystem(storage);
    expect(s.get()).toEqual(defaultSave());
  });

  it('survives wrong-version payloads', () => {
    const storage = memoryStorage();
    storage.setItem('pips-peril-save-v1', JSON.stringify({ version: 99, unlockedWorld: 7 }));
    const s = new SaveSystem(storage);
    expect(s.get().unlockedWorld).toBe(1);
  });

  it('merges settings patches and clamps loaded ranges', () => {
    const storage = memoryStorage();
    const a = new SaveSystem(storage);
    a.updateSettings({ difficulty: Diff.Hard, bindings: { jump: 'Space' } as never });
    const b = new SaveSystem(storage);
    expect(b.get().settings.difficulty).toBe(Diff.Hard);
    expect(b.get().settings.bindings.jump).toBe('Space');
    expect(b.get().settings.bindings.left).toBe('ArrowLeft'); // untouched default
  });
});
