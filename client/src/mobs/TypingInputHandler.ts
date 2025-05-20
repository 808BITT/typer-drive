import Phaser from 'phaser';
import type { IMob, MobConfig } from '../mobs/Mob';

export class TypingInputHandler {
  private scene: Phaser.Scene;
  private mobGetter: () => Map<string, IMob>;
  private keyPressListeners: Phaser.Input.Keyboard.KeyboardPlugin;
  private missCallback: () => void;
  private typedCallback: (letter: string, success: boolean) => void;

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

  private setupKeyboardListeners(): void {
    // Set up a listener for all alphanumeric keys and common symbols
    this.keyPressListeners.on('keydown', (event: KeyboardEvent) => {
      // Check if the key is a letter, number, or common symbol
      if ((event.key.length === 1 && /[a-zA-Z0-9\s\-=\[\];',\.\/!@#$%^&*()_+{}:"<>?]/.test(event.key))) {
        this.handleKeyPress(event.key.toLowerCase());
      }
    });
  }

  private handleKeyPress(key: string): void {
    const mobs = this.mobGetter();
    if (!mobs || mobs.size === 0) return;
    
    // Sort mobs by proximity to player (left side of screen)
    const sortedMobs = Array.from(mobs.values())
      .filter(mob => mob.active)
      .sort((a, b) => a.mobPosition.x - b.mobPosition.x);
    
    if (sortedMobs.length === 0) return;
    
    let success = false;
    
    // Try to find a mob that accepts this keypress
    for (const mob of sortedMobs) {
      if (mob.onTyped(key)) {
        success = true;
        break;
      }
    }
    
    // Call the appropriate callbacks
    if (!success) {
      this.missCallback();
      
      // Create a miss visual effect
      const missEffect = this.scene.add.particles(100, sortedMobs[0].mobPosition.y, 'miss-particle', {
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
    
    // Call the typed callback
    this.typedCallback(key, success);
  }

  cleanup(): void {
    // Remove event listeners
    this.keyPressListeners.off('keydown');
  }
}
