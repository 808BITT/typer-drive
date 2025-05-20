// InputManager.ts
//
// Usage Example:
//   import InputManager from './InputManager';
//   InputManager.create(this, ['W', 'A', 'S', 'D', 'SPACE']);
//   if (InputManager.isKeyDown('W')) { /* ... */ }
//
import Phaser from 'phaser';

class InputManager {
    private static keys: Record<string, Phaser.Input.Keyboard.Key> = {};

    /**
     * Sets up key listeners for the given keys on the provided scene.
     * @param scene The Phaser.Scene to attach input to.
     * @param keys Array of key names, e.g., ['W', 'A', 'S', 'D', 'SPACE']
     */
    static create(scene: Phaser.Scene, keys: string[]) {
        const keyMap: Record<string, string> = {};
        keys.forEach(k => { keyMap[k] = k; });
        const phaserKeys = scene.input.keyboard.addKeys(keyMap) as Record<string, Phaser.Input.Keyboard.Key>;
        keys.forEach(k => { this.keys[k] = phaserKeys[k]; });
    }

    /**
     * Returns true if the specified key is currently down.
     * @param key Key name, e.g., 'W', 'SPACE'
     */
    static isKeyDown(key: string): boolean {
        return this.keys[key]?.isDown ?? false;
    }

    /**
     * Subscribe to a key down event.
     * @param key Key name
     * @param callback Function to call on key down
     */
    static onKeyDown(key: string, callback: () => void) {
        this.keys[key]?.on('down', callback);
    }

    /**
     * Subscribe to a key up event.
     * @param key Key name
     * @param callback Function to call on key up
     */
    static onKeyUp(key: string, callback: () => void) {
        this.keys[key]?.on('up', callback);
    }
}

export default InputManager;

// Contains AI-generated edits.