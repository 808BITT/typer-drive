import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MobSpawner } from '../src/mobs/MobSpawner';

// Mock Phaser.Scene
const mockScene = {
  add: {},
  time: { addEvent: vi.fn(), delayedCall: vi.fn() },
  events: { emit: vi.fn() },
  scale: { width: 800, height: 600 },
};

describe('MobSpawner', () => {
  let spawner: MobSpawner;

  beforeEach(() => {
    spawner = new MobSpawner(mockScene as any, {
      totalWaves: 3,
      initialSpawnInterval: 1000,
      gameWidth: 800,
      gameHeight: 600,
    });
  });

  it('should initialize with correct wave count', () => {
    expect((spawner as any).waveCount).toBe(3);
  });

  it('should start a wave and set isSpawning to true', () => {
    spawner.startWave();
    expect((spawner as any).isSpawning).toBe(true);
  });

  it('should call onWaveComplete callback', () => {
    const cb = vi.fn();
    spawner = new MobSpawner(mockScene as any, {
      totalWaves: 1,
      initialSpawnInterval: 1000,
      gameWidth: 800,
      gameHeight: 600,
      onWaveComplete: cb,
    });
    spawner['onWaveComplete'](1);
    expect(cb).toHaveBeenCalledWith(1);
  });
});
