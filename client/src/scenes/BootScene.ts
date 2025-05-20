import Phaser from 'phaser';

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
        this.scene.start('MainMenu');
    }

    update(time: number, delta: number) {
        // Optional: loading progress or animations
    }
}