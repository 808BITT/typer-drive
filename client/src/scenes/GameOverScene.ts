// GameOverScene.ts
// Game over screen with stats for Typer Drive
// Contains AI-generated edits.

import Phaser from 'phaser';

interface GameOverData {
    score: number;
    maxCombo: number;
    accuracy: number;
    wpm: number;
}

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data: GameOverData) {
        const { width, height } = this.sys.game.canvas;
        this.add.rectangle(width / 2, height / 2, 400, 300, 0x000000, 0.8);
        this.add.text(width / 2, height / 2 - 100, 'Game Over', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 40, `Score: ${data.score}`, { fontSize: '28px', color: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 - 10, `Max Combo: ${data.maxCombo}`, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 20, `Accuracy: ${data.accuracy.toFixed(1)}%`, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 50, `WPM: ${data.wpm.toFixed(1)}`, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

        const restartBtn = this.add.text(width / 2, height / 2 + 100, 'Restart', { fontSize: '28px', color: '#fff', backgroundColor: '#333' })
            .setOrigin(0.5)
            .setInteractive();
        const quitBtn = this.add.text(width / 2, height / 2 + 150, 'Quit', { fontSize: '28px', color: '#fff', backgroundColor: '#333' })
            .setOrigin(0.5)
            .setInteractive();

        restartBtn.on('pointerup', () => {
            this.scene.stop('GameOverScene');
            this.scene.start('GameScene');
        });
        quitBtn.on('pointerup', () => {
            this.scene.stop('GameOverScene');
            this.scene.start('MainMenuScene');
        });
    }
}
