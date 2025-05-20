// HUD.ts - Enhanced Heads-Up Display for Typing Game with animations and visuals
// Updated on 2025-05-19

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

    // UI Elements
    wpmText?: Phaser.GameObjects.Text;
    accuracyText?: Phaser.GameObjects.Text;
    goalText?: Phaser.GameObjects.Text;
    hudBg?: Phaser.GameObjects.Rectangle;
    wpmMeter?: Phaser.GameObjects.Graphics;
    wpmFill?: Phaser.GameObjects.Graphics;
    accuracyMeter?: Phaser.GameObjects.Graphics;
    accuracyFill?: Phaser.GameObjects.Graphics;
    goalBar?: Phaser.GameObjects.Graphics;
    goalFill?: Phaser.GameObjects.Graphics;
    goalBarWidth: number = 300;
    
    // Animation properties
    private progressTween?: Phaser.Tweens.Tween;
    private particleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
    private confettiEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
    private sparkleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter; constructor(scene: Phaser.Scene, options: HUDOptions) {
        this.scene = scene;
        this.width = scene.scale.width;
        this.height = scene.scale.height;
        this.minWords = options.minWords;
        this.minWPM = options.minWPM;
        this.minAccuracy = options.minAccuracy;
        this.createHUD();
        this.setupParticles();
    }

    private createHUD() {
        // Animated starfield background for HUD
        const starParticles = this.scene.add.particles(0, 0, 'white', {
            x: { min: 0, max: this.width },
            y: { min: this.height - 90, max: this.height },
            speedY: { min: 10, max: 30 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 2000,
            quantity: 1,
            frequency: 100,
            blendMode: 'ADD',
        });
        starParticles.setDepth(-1);

        // Create glass-like background with gradient
        this.hudBg = this.scene.add.rectangle(this.width / 2, this.height - 50, this.width, 90, 0x000033, 0.8)
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(2, 0x4466ff, 0.7);

        // Goal display moved to top of the screen for better visibility
        const goalBg = this.scene.add.rectangle(this.width / 2, 20, 600, 40, 0x000033, 0.8)
            .setOrigin(0.5, 0)
            .setStrokeStyle(2, 0x22aaff, 0.7);

        this.goalText = this.scene.add.text(this.width / 2, 40,
            `Goal: ${this.minWords} words, ${this.minWPM} WPM, ${this.minAccuracy}% accuracy`, {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffea00',
            align: 'center',
            stroke: '#000',
            strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 5, stroke: true, fill: true }
        }).setOrigin(0.5, 0.5);

        // WPM meter with animated fill
        const wpmLabel = this.scene.add.text(40, this.height - 70, "WPM:", {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#88ff88',
            align: 'left',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);

        this.wpmText = this.scene.add.text(110, this.height - 70, `0`, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#00ff00',
            align: 'left',
            stroke: '#000',
            strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 3, stroke: true, fill: true }
        }).setOrigin(0, 0.5);

        // WPM meter background and fill
        this.wpmMeter = this.scene.add.graphics();
        this.wpmMeter.fillStyle(0x111111, 1);
        this.wpmMeter.fillRect(40, this.height - 45, 200, 16);
        this.wpmMeter.lineStyle(2, 0x00aa00, 1);
        this.wpmMeter.strokeRect(40, this.height - 45, 200, 16);

        this.wpmFill = this.scene.add.graphics();
        this.wpmFill.fillStyle(0x00ff00, 1);
        // Will be updated dynamically

        // Accuracy meter
        const accuracyLabel = this.scene.add.text(this.width / 2 - 100, this.height - 70, "Accuracy:", {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#88ffff',
            align: 'center',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);

        this.accuracyText = this.scene.add.text(this.width / 2 + 20, this.height - 70, `100%`, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#00ffff',
            align: 'left',
            stroke: '#000',
            strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000', blur: 3, stroke: true, fill: true }
        }).setOrigin(0, 0.5);

        // Accuracy meter background and fill
        this.accuracyMeter = this.scene.add.graphics();
        this.accuracyMeter.fillStyle(0x111111, 1);
        this.accuracyMeter.fillRect(this.width / 2 - 100, this.height - 45, 200, 16);
        this.accuracyMeter.lineStyle(2, 0x00aaaa, 1);
        this.accuracyMeter.strokeRect(this.width / 2 - 100, this.height - 45, 200, 16);

        this.accuracyFill = this.scene.add.graphics();
        this.accuracyFill.fillStyle(0x00ffff, 1);
        this.accuracyFill.fillRect(this.width / 2 - 100, this.height - 45, 200, 16);

        // Progress bar that shows completed words / goal words
        const progressLabel = this.scene.add.text(this.width - 260, this.height - 70, "Progress:", {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ff88ff',
            align: 'right',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);

        this.goalBar = this.scene.add.graphics();
        this.goalBar.fillStyle(0x111111, 1);
        this.goalBar.fillRect(this.width - 180, this.height - 45, this.goalBarWidth / 2, 16);
        this.goalBar.lineStyle(2, 0xaa00aa, 1);
        this.goalBar.strokeRect(this.width - 180, this.height - 45, this.goalBarWidth / 2, 16);

        this.goalFill = this.scene.add.graphics();
        this.goalFill.fillStyle(0xff00ff, 1);
        // Will be updated dynamically

        // Add animated glow to goal text
        if (this.goalText) {
            this.scene.tweens.add({
                targets: this.goalText,
                alpha: { from: 0.8, to: 1 },
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }

        // Add floating animation to meters
        [this.wpmText, this.accuracyText].forEach(txt => {
            if (txt) {
                this.scene.tweens.add({
                    targets: txt,
                    y: '+=4',
                    duration: 1800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                });
            }
        });
    }

    private setupParticles() {
        // Create particle emitter for visual feedback
        this.particleEmitter = this.scene.add.particles(0, 0, 'white', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: 100,
            quantity: 1
        });

        // Confetti emitter for goal completion
        this.confettiEmitter = this.scene.add.particles(0, 0, 'white', {
            speed: { min: 100, max: 300 },
            angle: { min: 200, max: 340 },
            scale: { start: 0.6, end: 0 },
            tint: [0xffea00, 0x00ffea, 0xff00ea, 0x00ff00, 0xff4400],
            blendMode: 'ADD',
            lifespan: 1200,
            gravityY: 400,
            quantity: 1
        });

        // Sparkle emitter for meter fill
        this.sparkleEmitter = this.scene.add.particles(0, 0, 'white', {
            speed: { min: 40, max: 80 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            tint: [0xffffff, 0xffea00, 0x00ffff],
            blendMode: 'ADD',
            lifespan: 500,
            quantity: 1
        });
    }

    updateWPM(wpm: number) {
        // Update text
        this.wpmText?.setText(`${wpm}`);

        // Animate WPM meter fill
        if (this.wpmFill) {
            this.wpmFill.clear();
            this.wpmFill.fillStyle(this.getWpmColor(wpm), 1);

            // Calculate width based on WPM relative to goal
            const percentOfGoal = Math.min(wpm / this.minWPM, 1);
            const fillWidth = Math.max(percentOfGoal * 200, 5); // At least 5 pixels wide

            // Animate the fill with a tween
            if (this.progressTween) this.progressTween.remove();
            this.progressTween = this.scene.tweens.add({
                targets: { width: 0 },
                width: fillWidth,
                duration: 400,
                ease: 'Power2',
                onUpdate: (tween, target) => {
                    this.wpmFill?.clear();
                    this.wpmFill?.fillStyle(this.getWpmColor(wpm), 1);
                    this.wpmFill?.fillRect(40, this.height - 45, target.width, 16);
                }
            });

            // Pulse animation for the text if we're above the goal
            if (wpm >= this.minWPM) {
                this.scene.tweens.add({
                    targets: this.wpmText,
                    scale: 1.2,
                    duration: 200,
                    yoyo: true,
                    ease: 'Power2'
                });
            }
        }
    }

    updateAccuracy(accuracy: number) {
            // Update text
            this.accuracyText?.setText(`${accuracy}%`);

            // Animate accuracy meter
            if (this.accuracyFill) {
                this.accuracyFill.clear();
                this.accuracyFill.fillStyle(this.getAccuracyColor(accuracy), 1);

                // Calculate width based on accuracy
                const fillWidth = (accuracy / 100) * 200;

                // Animate the fill
                this.scene.tweens.add({
                    targets: { width: 0 },
                    width: fillWidth,
                    duration: 400,
                    ease: 'Power2',
                    onUpdate: (tween, target) => {
                        this.accuracyFill?.clear();
                        this.accuracyFill?.fillStyle(this.getAccuracyColor(accuracy), 1);
                        this.accuracyFill?.fillRect(this.width / 2 - 100, this.height - 45, target.width, 16);
                    }
                });
            }
        }

    updateGoalText(words: number, wpm: number, accuracy: number) {
        // Update text with more visual appeal
        const wordProgress = `${words}/${this.minWords}`;
        const wpmStatus = wpm >= this.minWPM ? '✓' : '...';
        const accuracyStatus = accuracy >= this.minAccuracy ? '✓' : '...';

        this.goalText?.setText(`Goal: ${wordProgress} words ${wpmStatus}  ${this.minWPM} WPM ${wpmStatus}  ${this.minAccuracy}% accuracy ${accuracyStatus}`);

        // Update the progress bar
        if (this.goalFill) {
            this.goalFill.clear();

            // Calculate progress
            const percentComplete = Math.min(words / this.minWords, 1);
            const fillWidth = (this.goalBarWidth / 2) * percentComplete;

            // Animate the fill
            if (this.progressTween) this.progressTween.remove();
            this.progressTween = this.scene.tweens.add({
                targets: { width: 0 },
                width: fillWidth,
                duration: 400,
                ease: 'Power2',
                onUpdate: (tween, target) => {
                    this.goalFill?.clear();
                    this.goalFill?.fillStyle(0xff00ff, 1);
                    this.goalFill?.fillRect(this.width - 180, this.height - 45, target.width, 16);
                }
            });
        }
    }

    // Create color gradient based on WPM performance
    private getWpmColor(wpm: number): number {
        if (wpm >= this.minWPM * 1.5) return 0xffff00; // Gold for excellent
        if (wpm >= this.minWPM) return 0x00ff00;      // Green for meeting goal
        if (wpm >= this.minWPM * 0.7) return 0x88ff00; // Yellow-green for getting close
        if (wpm >= this.minWPM * 0.4) return 0xffaa00; // Orange for medium progress
        return 0xff4400;                              // Red for low progress
    }

    // Create color gradient based on accuracy performance
    private getAccuracyColor(accuracy: number): number {
        if (accuracy >= this.minAccuracy * 1.1) return 0x00ffff;  // Cyan for excellent
        if (accuracy >= this.minAccuracy) return 0x00ccff;       // Blue for meeting goal
        if (accuracy >= this.minAccuracy * 0.9) return 0x88aaff; // Lighter blue for getting close
        if (accuracy >= this.minAccuracy * 0.8) return 0xffaa00; // Orange for medium accuracy
        return 0xff4400;                                        // Red for low accuracy
    }

    // Show particles for feedback
    showParticles(x: number, y: number, isCorrect: boolean = true) {
        if (!this.particleEmitter) return;
        this.particleEmitter.setPosition(x, y);
        // Set tint directly on the emitter before exploding
        (this.particleEmitter as any).tint = isCorrect ? 0x00ff00 : 0xff0000;
        this.particleEmitter.explode(isCorrect ? 15 : 8);
        // Sparkle effect for correct
        if (isCorrect && this.sparkleEmitter) {
            this.sparkleEmitter.setPosition(x, y);
            (this.sparkleEmitter as any).tint = 0xffffff;
            this.sparkleEmitter.explode(10);
        }
    }

    // Show a celebratory effect after completing a word correctly
    showWordCompletionEffect() {
        if (!this.particleEmitter) return;
        // Create a line of particles across the center
        const centerY = this.height / 2 + 60; // Where the input text is
        for (let x = this.width / 2 - 100; x <= this.width / 2 + 100; x += 20) {
            this.particleEmitter.setPosition(x, centerY);
            (this.particleEmitter as any).tint = 0xffff00;
            this.particleEmitter.explode(5);
        }
        // Confetti burst at top for goal progress
        if (this.confettiEmitter) {
            this.confettiEmitter.setPosition(this.width / 2, 60);
            (this.confettiEmitter as any).tint = [0xffea00, 0x00ffea, 0xff00ea, 0x00ff00, 0xff4400];
            this.confettiEmitter.explode(40);
        }
        // Flash the goal text
        this.scene.tweens.add({
            targets: this.goalText,
            alpha: 0.2,
            duration: 100,
            yoyo: true,
            repeat: 1
        });
    }
}
