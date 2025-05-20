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
    private letterColors: string[] = []; // Array to track colors for each letter
    private wpm: number = 0;
    private accuracy: number = 100;
    private wpmText?: Phaser.GameObjects.Text;
    private accuracyText?: Phaser.GameObjects.Text;
    private startTime: number = 0;
    private totalTyped: number = 0;
    private totalCorrect: number = 0;
    private previousWords: Phaser.GameObjects.Container[] = [];
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
        // Create a simple white particle for celebrations
        this.textures.generate('white', {
            data: ['1'],
            pixelWidth: 2,
            pixelHeight: 2
        });
        // TODO: Load actual game assets
    }

    create() {
        const { width, height } = this.scale;
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

        // HUD
        this.createHUD(width, height);

        // Target and input
        this.generateTargetString();
        this.inputString = '';
        this.letterColors = [];
        this.letterText = this.add.text(width / 2, centerY, this.targetString, {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ff0',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.inputText = this.add.text(width / 2, centerY + 60, '', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#fff',
            align: 'center',
            stroke: '#000',
            strokeThickness: 4,
            // Enable BBCode parsing for per-letter coloring
            // @ts-ignore
            parseBBCode: true
        }).setOrigin(0.5);

        // Previous words
        this.previousWords = [];
        this.previousWordsY = centerY + 120;
        this.startTime = this.time.now;
        this.totalTyped = 0;
        this.totalCorrect = 0;
        this.completedWords = 0;

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
                this.letterColors.push('#0f0');
                correct = true;
            } else {
                this.inputString += typedChar;
                this.letterColors.push('#f00');
            }
            this.updateInputText();
            this.updateAccuracy();
            if (this.inputString.length === this.targetString.length) {
                this.score += correct ? 1 : 0;
                this.completedWords++;
                this.scoreText?.setText(`Score: ${this.score}`);
                // Pass a copy of the letterColors for correct per-letter coloring
                const wordColors = [...this.letterColors];
                this.showPreviousWord(this.targetString, wordColors);
                this.inputString = '';
                this.letterColors = [];
                this.generateTargetString();
                this.letterText.setText(this.targetString);
                // Immediately update input display to show underscores
                this.updateInputText();
                this.inputText.setText('');
                this.inputText.setStyle({ color: '#fff' });
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

    private showPreviousWord(word: string, colors: string[]) {
        const { width } = this.scale;
        // Move existing previous words down and fade
        this.previousWords.forEach((group, i) => {
            this.tweens.add({
                targets: group,
                y: group.y + 40,
                alpha: 0.5 - i * 0.2,
                duration: 200,
                onComplete: () => {
                    if (i >= 1) group.destroy();
                }
            });
        });
        // Add new word below the current word
        // Show per-letter coloring for the previous word using individual Text objects
        const baseX = width / 2 - (word.length * 18) / 2;
        let x = baseX;
        const y = this.previousWordsY;
        const prevLetters: Phaser.GameObjects.Text[] = [];
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const color = colors[i] || '#fff';
            const letterObj = this.add.text(x, y, char, {
                fontFamily: 'Arial',
                fontSize: '32px',
                color,
                align: 'center',
                stroke: '#000',
                strokeThickness: 4
            }).setOrigin(0, 0.5);
            prevLetters.push(letterObj);
            x += 18;
        }
        // Group the letters for tweening/fading
        const group = this.add.container(0, 0, prevLetters);
        group.setPosition(0, y);
        group.setAlpha(1);
        this.previousWords.unshift(group as any);
        // Keep only 2 previous
        if (this.previousWords.length > 2) {
            const removed = this.previousWords.pop();
            removed?.destroy();
        }
    } private checkGoal() {
        if (this.completedWords >= this.minWords && this.wpm >= this.minWPM && this.accuracy >= this.minAccuracy) {
            if (!this.resultText) {
                const { width, height } = this.scale;

                // Create a celebration effect
                const particles = this.add.particles(0, 0, 'white', {
                    x: width / 2,
                    y: height / 2,
                    speed: { min: 200, max: 300 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 0.6, end: 0 },
                    blendMode: 'ADD',
                    lifespan: 1000,
                    gravityY: 300,
                    quantity: 50
                });

                // Show achievement text
                this.resultText = this.add.text(width / 2, height / 2, 'Level Complete!', {
                    fontFamily: 'Arial',
                    fontSize: '48px',
                    color: '#ffff00',
                    align: 'center',
                    stroke: '#000',
                    strokeThickness: 6
                }).setOrigin(0.5);

                // Add stats summary
                const statsText = this.add.text(width / 2, height / 2 + 60,
                    `Words: ${this.completedWords}   WPM: ${this.wpm}   Accuracy: ${this.accuracy}%`, {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff',
                    align: 'center',
                    stroke: '#000',
                    strokeThickness: 3
                }).setOrigin(0.5);

                // Show continue button
                const continueButton = this.add.rectangle(width / 2, height / 2 + 120, 200, 50, 0x3355ff)
                    .setInteractive({ useHandCursor: true })
                    .setOrigin(0.5);

                const continueText = this.add.text(width / 2, height / 2 + 120, 'Continue', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#fff',
                    align: 'center'
                }).setOrigin(0.5);

                continueButton.on('pointerover', () => continueButton.setFillStyle(0x5577ff));
                continueButton.on('pointerout', () => continueButton.setFillStyle(0x3355ff));
                continueButton.on('pointerdown', () => {
                    this.scene.start('LevelSelectScene');
                });

                // Auto-destroy particles after animation completes
                this.time.delayedCall(2000, () => {
                    particles.destroy();
                });
            }
        }
    }

    /**
     * Create a dedicated HUD method for better organization
     * @param width The width of the game canvas
     * @param height The height of the game canvas
     * @returns An object containing references to dynamic UI elements
     */
    private createHUD(width: number, height: number) {
        // Background for HUD
        const hudBg = this.add.rectangle(width / 2, height - 50, width, 80, 0x000000, 0.7)
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(1, 0x3333ff, 0.5);

        // Score display (left)
        this.scoreText = this.add.text(40, height - 60, `Score: 0`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#fff',
            align: 'left',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // WPM meter with gauge visualization (center)
        this.wpmText = this.add.text(width / 2, height - 60, `WPM: 0`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0f0',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        // WPM visual meter
        const wpmMeter = this.add.graphics();
        wpmMeter.fillStyle(0x222222, 1);
        wpmMeter.fillRect(width / 2 - 50, height - 45, 100, 10);
        this.add.text(width / 2, height - 45, '|', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(0.5, 0);

        // Accuracy display (right)
        this.accuracyText = this.add.text(width - 40, height - 60, `Accuracy: 100%`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#0ff',
            align: 'right',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(1, 0.5);

        // Goal display (bottom)
        this.goalText = this.add.text(width / 2, height - 30, `Goal: ${this.minWords} words, ${this.minWPM} WPM, ${this.minAccuracy}% accuracy`, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#fff',
            align: 'center',
            stroke: '#222',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Progress visualization toward goals
        const goalBarWidth = 300;
        const goalBar = this.add.graphics();
        goalBar.lineStyle(1, 0x444444, 1);
        goalBar.strokeRect(width / 2 - goalBarWidth / 2, height - 15, goalBarWidth, 6);

        // This container will hold dynamic UI updates in update()
        return { wpmMeter, goalBar, goalBarWidth };
    }

    /**
     * Updates the input text display with per-letter coloring.
     * Each letter is colored green if correct, red if wrong, white if not yet typed.
     */
    private updateInputText() {
        if (!this.inputText) return;
        // Remove previous letter objects if any
        if ((this as any)._inputLetterObjects) {
            (this as any)._inputLetterObjects.forEach((obj: Phaser.GameObjects.Text) => obj.destroy());
        }
        (this as any)._inputLetterObjects = [];
        const { width } = this.scale;
        const baseX = width / 2 - (this.targetString.length * 24) / 2;
        let x = baseX;
        for (let i = 0; i < this.targetString.length; i++) {
            let char = '_';
            let color = '#888';
            if (i < this.inputString.length) {
                char = this.inputString[i];
                color = this.letterColors[i] || '#fff';
            }
            const letterObj = this.add.text(x, this.inputText.y, char, {
                fontFamily: 'Arial',
                fontSize: '40px',
                color,
                align: 'center',
                stroke: '#000',
                strokeThickness: 4
            }).setOrigin(0, 0.5);
            (this as any)._inputLetterObjects.push(letterObj);
            x += 24;
        }
        // Hide the old inputText object
        this.inputText.setVisible(false);
    }

    /**
     * Flash the target string with a color, then revert to yellow.
     */
    private flashTargetString(color: string) {
        if (!this.letterText) return;
        this.letterText.setColor(color);
        this.time.delayedCall(200, () => {
            this.letterText?.setColor('#ff0');
        });
    }

    update(time: number, delta: number) {
        // Update progress bars based on current stats
        if (this.wpm > 0 || this.completedWords > 0) {
            const { width, height } = this.scale;

            // Update WPM visual meter
            const wpmMeter = this.add.graphics();
            wpmMeter.clear();
            wpmMeter.fillStyle(0x222222, 1);
            wpmMeter.fillRect(width / 2 - 50, height - 45, 100, 10);

            // Fill based on percentage of goal reached
            const wpmPercent = Math.min(this.wpm / this.minWPM, 1);
            wpmMeter.fillStyle(
                wpmPercent < 0.5 ? 0xdd5555 :
                    wpmPercent < 0.8 ? 0xdddd55 : 0x55dd55,
                1
            );
            wpmMeter.fillRect(width / 2 - 50, height - 45, 100 * wpmPercent, 10);

            // Progress toward goal
            const goalBar = this.add.graphics();
            goalBar.clear();
            goalBar.lineStyle(1, 0x444444, 1);
            goalBar.strokeRect(width / 2 - 150, height - 15, 300, 6);

            // Fill based on words completed
            const wordPercent = Math.min(this.completedWords / this.minWords, 1);
            goalBar.fillStyle(0x3333ff, 0.8);
            goalBar.fillRect(width / 2 - 150, height - 15, 300 * wordPercent, 6);

            // Set WPM color based on performance
            if (this.wpmText) {
                this.wpmText.setColor(
                    this.wpm < this.minWPM * 0.5 ? '#dd5555' :
                        this.wpm < this.minWPM * 0.8 ? '#dddd55' : '#55dd55'
                );
            }

            // Set accuracy color based on performance
            if (this.accuracyText) {
                this.accuracyText.setColor(
                    this.accuracy < this.minAccuracy * 0.8 ? '#dd5555' :
                        this.accuracy < this.minAccuracy ? '#dddd55' : '#55ddff'
                );
            }
        }
    }
}
