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
    private targetString: string = '';
    private inputString: string = '';
    private inputText?: Phaser.GameObjects.Text;
    private wpm: number = 0;
    private accuracy: number = 100;
    private wpmText?: Phaser.GameObjects.Text;
    private accuracyText?: Phaser.GameObjects.Text;
    private startTime: number = 0;
    private totalTyped: number = 0;
    private totalCorrect: number = 0;
    private previousWords: Phaser.GameObjects.Text[] = [];
    private minWords: number = 10; // Example goal
    private minWPM: number = 20;
    private minAccuracy: number = 90;
    private completedWords: number = 0;
    private goalText?: Phaser.GameObjects.Text;
    private resultText?: Phaser.GameObjects.Text;
    private previousWordsY: number = 0;

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
        // Move the target and input higher up
        const centerY = height / 2 - 60;
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

        // Score display
        this.scoreText = this.add.text(40, height - 60, `Score: 0`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            align: 'left',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // WPM and Accuracy meters
        this.wpmText = this.add.text(width / 2, height - 60, `WPM: 0`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0f0',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        this.accuracyText = this.add.text(width - 40, height - 60, `Accuracy: 100%`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0ff',
            align: 'right',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(1, 0.5);

        // Goal display
        this.goalText = this.add.text(width / 2, height - 30, `Goal: ${this.minWords} words, ${this.minWPM} WPM, ${this.minAccuracy}% accuracy`, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#fff',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Generate first target string
        this.generateTargetString();
        this.inputString = '';
        this.inputText = this.add.text(width / 2, centerY + 60, '', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            align: 'center',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Show target string (move up)
        this.letterText = this.add.text(width / 2, centerY, this.targetString, {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ff0',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Previous words list (now below input/current)
        this.previousWords = [];
        this.previousWordsY = centerY + 120;

        // Move stats to the bottom (HUD style)
        this.scoreText = this.add.text(40, height - 60, `Score: 0`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            align: 'left',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(0, 0.5);
        this.wpmText = this.add.text(width / 2, height - 60, `WPM: 0`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0f0',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        this.accuracyText = this.add.text(width - 40, height - 60, `Accuracy: 100%`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0ff',
            align: 'right',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(1, 0.5);
        this.goalText = this.add.text(width / 2, height - 30, `Goal: ${this.minWords} words, ${this.minWPM} WPM, ${this.minAccuracy}% accuracy`, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#fff',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.startTime = this.time.now;
        this.totalTyped = 0;
        this.totalCorrect = 0;

        // Keyboard input
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (!this.letters || !this.letterText || !this.inputText) return;
            if (event.key.length !== 1) return;
            if (this.inputString.length >= this.targetString.length) return;
            const expectedChar = this.targetString[this.inputString.length];
            const typedChar = event.key.toUpperCase();
            this.totalTyped++;
            let correct = false;
            if (typedChar === expectedChar) {
                this.inputString += typedChar;
                this.totalCorrect++;
                this.inputText.setText(this.inputString);
                this.inputText.setColor('#0f0');
                correct = true;
            } else {
                this.inputString += typedChar;
                this.inputText.setText(this.inputString);
                this.inputText.setColor('#f00');
            }
            this.updateAccuracy();
            if (this.inputString.length === this.targetString.length) {
                // Completed string
                this.score += correct ? 1 : 0;
                this.completedWords++;
                this.scoreText?.setText(`Score: ${this.score}`);
                // Slide previous words down and fade
                this.showPreviousWord(this.targetString, correct);
                this.inputString = '';
                this.generateTargetString();
                this.letterText.setText(this.targetString);
                this.inputText.setText('');
                this.inputText.setColor('#fff');
                this.updateWPM();
                this.checkGoal();
            }
        });
    }

    private generateTargetString() {
        // Pick 5 random letters from this.letters
        this.targetString = Array.from({ length: 5 }, () => {
            const idx = Math.floor(Math.random() * this.letters.length);
            return this.letters[idx];
        }).join('');
    }

    private updateWPM() {
        const elapsedMinutes = (this.time.now - this.startTime) / 60000;
        this.wpm = elapsedMinutes > 0 ? Math.round((this.score * 5) / elapsedMinutes) : 0;
        this.wpmText?.setText(`WPM: ${this.wpm}`);
    }

    private updateAccuracy() {
        this.accuracy = this.totalTyped > 0 ? Math.round((this.totalCorrect / this.totalTyped) * 100) : 100;
        this.accuracyText?.setText(`Accuracy: ${this.accuracy}%`);
    }

    private showPreviousWord(word: string, correct: boolean) {
        const { width } = this.scale;
        // Move existing previous words down and fade
        this.previousWords.forEach((txt, i) => {
            this.tweens.add({
                targets: txt,
                y: txt.y + 40,
                alpha: 0.5 - i * 0.2,
                duration: 200,
                onComplete: () => {
                    if (i >= 1) txt.destroy();
                }
            });
        });
        // Add new word below the current word
        const color = correct ? '#0f0' : '#f00';
        const prev = this.add.text(width / 2, this.previousWordsY, word, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color,
            align: 'center',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        prev.setAlpha(1);
        this.previousWords.unshift(prev);
        // Keep only 2 previous
        if (this.previousWords.length > 2) {
            const removed = this.previousWords.pop();
            removed?.destroy();
        }
    }

    private checkGoal() {
        if (this.completedWords >= this.minWords && this.wpm >= this.minWPM && this.accuracy >= this.minAccuracy) {
            if (!this.resultText) {
                const { width, height } = this.scale;
                this.resultText = this.add.text(width / 2, height / 2 + 120, 'Goal Achieved!', {
                    fontFamily: 'Arial',
                    fontSize: '36px',
                    color: '#0f0',
                    align: 'center',
                    stroke: '#000',
                    strokeThickness: 4
                }).setOrigin(0.5);
            }
        }
    }

    update(time: number, delta: number) {
        // TODO: Main gameplay loop (input, scoring, etc.)
    }
}
