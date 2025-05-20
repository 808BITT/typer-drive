// GameScene for dynamic typing gameplay
// Implements Phaser.Scene and loads letters based on selected level and user statistics
// Auto-generated on 2025-05-19

import { LevelConfig } from '@/types';
import Phaser from 'phaser';

/**
 * GameScene - Main typing gameplay scene
 *
 * Letters and difficulty are determined by the selected level and user statistics.
 */
export class GameScene extends Phaser.Scene {
    private levelConfig: LevelConfig;
    private letters: string[];
    private currentLetterIndex: number = 0;
    private letterText?: Phaser.GameObjects.Text;
    private score: number = 0;
    private scoreText?: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });
    }

    /**
     * Initialize the scene with the selected level and user stats
     * @param levelConfig LevelConfig for the current level
     * @param userStats (optional) User statistics to adjust difficulty
     */
    init(data: { levelConfig: LevelConfig; userStats?: any }) {
        this.levelConfig = data.levelConfig;
        // TODO: Use userStats to adjust letters/difficulty
        this.letters = this.levelConfig.letters;
    }

    preload() {
        // TODO: Load assets for gameplay (sprites, backgrounds, audio)
    }

    create() {
        const { width, height } = this.scale;
        this.add.text(width / 2, 80, `Typing: ${this.levelConfig.name}`, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#fff',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#222',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Back to Level Select button
        const backButton = this.add.text(40, 30, '< Back', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            backgroundColor: '#1e2a38',
            padding: { left: 12, right: 12, top: 6, bottom: 6 },
            align: 'center',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        backButton.on('pointerover', () => backButton.setStyle({ backgroundColor: '#2d3e50' }));
        backButton.on('pointerout', () => backButton.setStyle({ backgroundColor: '#1e2a38' }));
        backButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

        // Show the first letter to type
        if (this.letters && this.letters.length > 0) {
            this.currentLetterIndex = 0;
            this.letterText = this.add.text(width / 2, height / 2, `Type: ${this.letters[this.currentLetterIndex]}`, {
                fontFamily: 'Arial',
                fontSize: '48px',
                color: '#ff0',
                align: 'center',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 6
            }).setOrigin(0.5);
        }

        // Score display
        this.scoreText = this.add.text(width - 40, 30, `Score: 0`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            align: 'right',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(1, 0.5);

        // Keyboard input
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (!this.letters || !this.letterText) return;
            const expected = this.letters[this.currentLetterIndex];
            if (event.key.toUpperCase() === expected) {
                this.score += 1;
                this.scoreText?.setText(`Score: ${this.score}`);
                // Next letter (cycle through letters)
                this.currentLetterIndex = (this.currentLetterIndex + 1) % this.letters.length;
                this.letterText.setText(`Type: ${this.letters[this.currentLetterIndex]}`);
            } else {
                // Optional: feedback for wrong key
                this.letterText.setColor('#f00');
                this.time.delayedCall(150, () => {
                    this.letterText?.setColor('#ff0');
                });
            }
        });
    }

    update(time: number, delta: number) {
        // TODO: Main gameplay loop (input, scoring, etc.)
    }
}
