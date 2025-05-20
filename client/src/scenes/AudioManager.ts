// AudioManager.ts
//
// Usage:
//   import AudioManager from './AudioManager';
//   AudioManager.preload(this); // in scene preload
//   AudioManager.play('laser');
//   AudioManager.setVolume(0.5);
//
import Phaser from 'phaser';

interface SoundDefinition {
    key: string;
    path: string;
}

const sounds: SoundDefinition[] = [
    { key: 'laser', path: 'audio/laser.mp3' },
    { key: 'explosion', path: 'audio/explosion.mp3' }
];

let globalVolume = 1.0;

const AudioManager = {
    preload(scene: Phaser.Scene) {
        sounds.forEach(sound => {
            if (!sound.key || !sound.path) {
                console.warn(`[AudioManager] Missing key or path for sound:`, sound);
                return;
            }
            scene.load.audio(sound.key, sound.path);
        });
    },

    play(key: string, config?: Phaser.Types.Sound.SoundConfig) {
        const scene = Phaser.Scene.prototype.sys.game.scene.getScenes(true)[0];
        if (!scene) {
            console.warn(`[AudioManager] No active scene to play sound.`);
            return;
        }
        const sound = scene.sound.get(key) || scene.sound.add(key);
        if (!sound) {
            console.warn(`[AudioManager] Sound not found: ${key}`);
            return;
        }
        sound.setVolume(globalVolume);
        sound.play(config);
    },

    setVolume(volume: number) {
        globalVolume = Phaser.Math.Clamp(volume, 0, 1);
        // Optionally update all currently playing sounds
        const scene = Phaser.Scene.prototype.sys.game.scene.getScenes(true)[0];
        if (scene) {
            scene.sound.sounds.forEach(snd => snd.setVolume(globalVolume));
        }
    }
};

export default AudioManager;
