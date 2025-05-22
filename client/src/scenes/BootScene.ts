import Phaser from 'phaser';
import { SceneTransition } from '../utils/SceneTransition';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load assets here (sprites, audio, etc.)
    }

    create() {
        // Setup initial state or transition to MainMenuScene
        console.log('BootScene loaded');
        SceneTransition.fadeToScene(this, 'MainMenu');
    }

    update(time: number, delta: number) {
        // Optional: loading progress or animations
    }
}