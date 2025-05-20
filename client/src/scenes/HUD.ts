// HUD.ts - Heads-Up Display for Typing Game
// Extracted from GameScene for modularity and clarity
// Auto-generated on 2025-05-19

import Phaser from 'phaser';

export interface HUDOptions {
    minWords: number;
    minWPM: number;
    minAccuracy: number;
}

export class HUD {
    private scene: Phaser.Scene;
    private width: number;
    private height: number;
    private minWords: number;
    private minWPM: number;
    private minAccuracy: number;

    scoreText?: Phaser.GameObjects.Text;
    wpmText?: Phaser.GameObjects.Text;
    accuracyText?: Phaser.GameObjects.Text;
    goalText?: Phaser.GameObjects.Text;
    hudBg?: Phaser.GameObjects.Rectangle;
    wpmMeter?: Phaser.GameObjects.Graphics;
    goalBar?: Phaser.GameObjects.Graphics;
    goalBarWidth: number = 300;

    constructor(scene: Phaser.Scene, options: HUDOptions) {
        this.scene = scene;
        this.width = scene.scale.width;
        this.height = scene.scale.height;
        this.minWords = options.minWords;
        this.minWPM = options.minWPM;
        this.minAccuracy = options.minAccuracy;
        this.createHUD();
    }

    private createHUD() {
        this.hudBg = this.scene.add.rectangle(this.width / 2, this.height - 50, this.width, 80, 0x000000, 0.7)
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(1, 0x3333ff, 0.5);
        this.scoreText = this.scene.add.text(40, this.height - 60, `Score: 0`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            align: 'left',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(0, 0.5);
        this.wpmText = this.scene.add.text(this.width / 2, this.height - 60, `WPM: 0`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0f0',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        this.accuracyText = this.scene.add.text(this.width - 40, this.height - 60, `Accuracy: 100%`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0ff',
            align: 'right',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(1, 0.5);
        this.goalText = this.scene.add.text(this.width / 2, this.height - 30, `Goal: ${this.minWords} words, ${this.minWPM} WPM, ${this.minAccuracy}% accuracy`, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#fff',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.goalBar = this.scene.add.graphics();
        this.goalBar.lineStyle(1, 0x444444, 1);
        this.goalBar.strokeRect(this.width / 2 - this.goalBarWidth / 2, this.height - 15, this.goalBarWidth, 6);
        this.wpmMeter = this.scene.add.graphics();
        this.wpmMeter.fillStyle(0x222222, 1);
        this.wpmMeter.fillRect(this.width / 2 - 50, this.height - 45, 100, 10);
        this.scene.add.text(this.width / 2, this.height - 45, '|', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(0.5, 0);
    }

    updateScore(score: number) {
        this.scoreText?.setText(`Score: ${score}`);
    }

    updateWPM(wpm: number) {
        this.wpmText?.setText(`WPM: ${wpm}`);
    }

    updateAccuracy(accuracy: number) {
        this.accuracyText?.setText(`Accuracy: ${accuracy}%`);
    }

    updateGoalText(words: number, wpm: number, accuracy: number) {
        this.goalText?.setText(`Goal: ${words} words, ${wpm} WPM, ${accuracy}% accuracy`);
    }
}
