import Phaser from 'phaser';
import type { IMob, MobConfig } from '../mobs/Mob';

export class TypingInputHandler {
  private scene: Phaser.Scene;
  private mobGetter: () => Map<string, IMob>;
  private keyPressListeners: Phaser.Input.Keyboard.KeyboardPlugin;
  private missCallback: () => void;
  private typedCallback: (letter: string, success: boolean) => void;
  private keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  constructor(scene: Phaser.Scene, config: {
    mobGetter: () => Map<string, IMob>;
    missCallback?: () => void;
    typedCallback?: (letter: string, success: boolean) => void;
  }) {
    this.scene = scene;
    this.mobGetter = config.mobGetter;
    this.missCallback = config.missCallback || (() => {});
    this.typedCallback = config.typedCallback || (() => {});
    this.keyPressListeners = scene.input.keyboard!;
    
    this.setupKeyboardListeners();
  }

  /**
   * Set up a single keydown listener for all alphanumeric keys and common symbols.
   * Ensures no duplicate listeners are attached.
   */
  private setupKeyboardListeners(): void {
    if (this.keydownHandler) {
      this.keyPressListeners.off('keydown', this.keydownHandler);
    }
    this.keydownHandler = (event: KeyboardEvent) => {
      // Normalize key: only process single visible characters
      if (event.key.length === 1 && /[\w\s\-\=\[\];',\.\/!@#$%^&*()_+{}:"<>?]/.test(event.key)) {
        // Use locale-insensitive lowercasing for consistency
        this.handleKeyPress(event.key.toLocaleLowerCase('en-US'));
      }
    };
    this.keyPressListeners.on('keydown', this.keydownHandler);
  }

  /**
   * Handles a key press by finding the closest active mob that accepts the input.
   * Optimized for minimal latency and correctness.
   */
  private handleKeyPress(key: string): void {
    const mobs = this.mobGetter();
    if (!mobs || mobs.size === 0) return;

    let sortedMobs: IMob[];
    if (mobs.size === 1) {
      // Avoid allocation/sorting if only one mob
      sortedMobs = Array.from(mobs.values());
    } else {
      sortedMobs = Array.from(mobs.values())
        .filter(mob => mob.active)
        .sort((a, b) => a.mobPosition.x - b.mobPosition.x);
    }
    if (sortedMobs.length === 0) return;

    let success = false;
    for (const mob of sortedMobs) {
      if (mob.onTyped(key)) {
        success = true;
        break;
      }
    }

    // Callbacks and effects
    if (!success) {
      this.missCallback();
      // Miss effect (minimal allocation)
      const missMob = sortedMobs[0];
      const missEffect = this.scene.add.particles(missMob.mobPosition.x, missMob.mobPosition.y, 'miss-particle', {
        lifespan: 300,
        speed: { min: 50, max: 80 },
        scale: { start: 0.5, end: 0 },
        tint: 0xff0000,
        quantity: 5,
        emitting: false
      });
      missEffect.explode();
      this.scene.time.delayedCall(300, () => {
        missEffect.destroy();
      });
    }
    this.typedCallback(key, success);
  }

  /**
   * Removes the keydown event listener to prevent memory leaks.
   */
  cleanup(): void {
    if (this.keydownHandler) {
      this.keyPressListeners.off('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
  }
}

// Contains AI-generated edits.
