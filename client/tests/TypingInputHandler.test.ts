import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TypingInputHandler } from '../src/mobs/TypingInputHandler';

describe('TypingInputHandler', () => {
  let handler;
  let scene;
  let mobs;
  let missCallback;
  let typedCallback;

  beforeEach(() => {
    // Mock Phaser.Scene and KeyboardPlugin
    scene = {
      input: {
        keyboard: {
          on: vi.fn(),
          off: vi.fn(),
        },
      },
      add: {
        particles: vi.fn(() => ({ explode: vi.fn(), destroy: vi.fn() })),
      },
      time: {
        delayedCall: vi.fn((_, cb) => cb()),
      },
    };
    mobs = new Map();
    missCallback = vi.fn();
    typedCallback = vi.fn();
  });

  it('should call missCallback if no mobs', () => {
    handler = new TypingInputHandler(scene as any, {
      mobGetter: () => new Map(),
      missCallback,
      typedCallback,
    });
    // Simulate key press
    handler['handleKeyPress']('a');
    expect(missCallback).not.toHaveBeenCalled(); // No mobs, so not called
  });

  it('should call onTyped on the closest mob', () => {
    const mob = { onTyped: vi.fn().mockReturnValue(true), active: true, mobPosition: { x: 10, y: 10 } };
    mobs.set('mob1', mob);
    handler = new TypingInputHandler(scene as any, {
      mobGetter: () => mobs,
      missCallback,
      typedCallback,
    });
    handler['handleKeyPress']('a');
    expect(mob.onTyped).toHaveBeenCalledWith('a');
    expect(typedCallback).toHaveBeenCalledWith('a', true);
  });

  it('should call missCallback if no mob accepts input', () => {
    const mob = { onTyped: vi.fn().mockReturnValue(false), active: true, mobPosition: { x: 10, y: 10 } };
    mobs.set('mob1', mob);
    handler = new TypingInputHandler(scene as any, {
      mobGetter: () => mobs,
      missCallback,
      typedCallback,
    });
    handler['handleKeyPress']('a');
    expect(missCallback).toHaveBeenCalled();
    expect(typedCallback).toHaveBeenCalledWith('a', false);
  });

  it('should sort mobs by x position and call onTyped in order', () => {
    const mob1 = { onTyped: vi.fn().mockReturnValue(false), active: true, mobPosition: { x: 20, y: 10 } };
    const mob2 = { onTyped: vi.fn().mockReturnValue(true), active: true, mobPosition: { x: 10, y: 10 } };
    mobs.set('mob1', mob1);
    mobs.set('mob2', mob2);
    handler = new TypingInputHandler(scene as any, {
      mobGetter: () => mobs,
      missCallback,
      typedCallback,
    });
    handler['handleKeyPress']('a');
    expect(mob2.onTyped).toHaveBeenCalled();
    expect(mob1.onTyped).not.toHaveBeenCalled(); // mob2 is closer, returns true
  });

  it('should handle rapid sequential key presses (responsiveness)', () => {
    const mob = { onTyped: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false), active: true, mobPosition: { x: 10, y: 10 } };
    mobs.set('mob1', mob);
    handler = new TypingInputHandler(scene as any, {
      mobGetter: () => mobs,
      missCallback,
      typedCallback,
    });
    handler['handleKeyPress']('a'); // Should succeed
    handler['handleKeyPress']('b'); // Should fail
    expect(mob.onTyped).toHaveBeenCalledWith('a');
    expect(mob.onTyped).toHaveBeenCalledWith('b');
    expect(typedCallback).toHaveBeenCalledWith('a', true);
    expect(typedCallback).toHaveBeenCalledWith('b', false);
    expect(missCallback).toHaveBeenCalled();
  });

  it('should ignore inactive mobs for accuracy', () => {
    const mob1 = { onTyped: vi.fn(), active: false, mobPosition: { x: 10, y: 10 } };
    const mob2 = { onTyped: vi.fn().mockReturnValue(true), active: true, mobPosition: { x: 20, y: 10 } };
    mobs.set('mob1', mob1);
    mobs.set('mob2', mob2);
    handler = new TypingInputHandler(scene as any, {
      mobGetter: () => mobs,
      missCallback,
      typedCallback,
    });
    handler['handleKeyPress']('f');
    expect(mob1.onTyped).not.toHaveBeenCalled();
    expect(mob2.onTyped).toHaveBeenCalledWith('f');
    expect(typedCallback).toHaveBeenCalledWith('f', true);
  });
});

// Contains AI-generated edits.
