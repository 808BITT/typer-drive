// PauseMenuScene.ts
// Simple pause menu overlay for Typer Drive
// Contains AI-generated edits.

import Phaser from 'phaser';

export default class PauseMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenuScene' });
    }

    create() {
        const { width, height } = this.sys.game.canvas;
        this.add.rectangle(width / 2, height / 2, 300, 200, 0x000000, 0.7);
        this.add.text(width / 2, height / 2 - 60, 'Paused', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);

        const resumeBtn = this.add.text(width / 2, height / 2 - 10, 'Resume', { fontSize: '24px', color: '#fff', backgroundColor: '#333' })
            .setOrigin(0.5)
            .setInteractive();
        const restartBtn = this.add.text(width / 2, height / 2 + 30, 'Restart', { fontSize: '24px', color: '#fff', backgroundColor: '#333' })
            .setOrigin(0.5)
            .setInteractive();
        const quitBtn = this.add.text(width / 2, height / 2 + 70, 'Quit', { fontSize: '24px', color: '#fff', backgroundColor: '#333' })
            .setOrigin(0.5)
            .setInteractive();

        resumeBtn.on('pointerup', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });
        restartBtn.on('pointerup', () => {
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
            this.scene.stop();
        });
        quitBtn.on('pointerup', () => {
            this.scene.stop('GameScene');
            this.scene.start('MainMenuScene');
            this.scene.stop();
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });
    }
}
