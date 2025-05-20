# Audio Manager

Generate an audio manager module.

- **Inputs:**
  - `sounds` (array): e.g., [{ key: 'laser', path: 'audio/laser.mp3' }, { key: 'explosion', path: 'audio/explosion.mp3' }]
- **Desired Output:**
  - A TypeScript file `AudioManager.ts` exporting an object with:
    - A `preload(scene: Phaser.Scene)` method to load sounds
    - A `play(key: string, config?: any)` method to play loaded sounds
    - A `setVolume(volume: number)` method for global volume control
