// GameScene for infinite survivor typing game
// Implements Phaser.Scene and spawns mobs (letters) that move left
// Auto-generated on 2025-05-19

import Phaser from 'phaser';
import { LevelConfig, getProgression, setProgression } from '@/types';
import { HUD } from '../entities/HUD';
import { World1Index } from '../levels/World1Index';
import { World2Middle } from '../levels/World2Middle';
import { World3Ring } from '../levels/World3Ring';
import { World4Pinky } from '../levels/World4Pinky';

/**
 * GameScene - Infinite Survivor Typing Game
 *
 * Letters (mobs) spawn on the right and move left on a conveyor belt.
 * Typing the correct letter destroys the mob. If a mob reaches the left edge, player loses health.
 * Score, combos, and difficulty ramp up over time.
 */
export class GameScene extends Phaser.Scene {
    private levelConfig!: LevelConfig;
    private letters!: string[];
    private currentLetterIndex: number = 0;
    private letterText?: Phaser.GameObjects.Text;
    private score: number = 0;
    private scoreText?: Phaser.GameObjects.Text;
    private wpm: number = 0;
    private accuracy: number = 100;
    private wpmText?: Phaser.GameObjects.Text;
    private accuracyText?: Phaser.GameObjects.Text;
    private startTime: number = 0;
    private totalTyped: number = 0;
    private totalCorrect: number = 0;
    private previousWords: Phaser.GameObjects.Container[] = [];
    private minWords: number = 10; // Now always 10 words per level
    private minWPM: number = 20;
    private minAccuracy: number = 90;
    private completedWords: number = 0;
    private failed: boolean = false;
    private goalText?: Phaser.GameObjects.Text;
    private resultText?: Phaser.GameObjects.Text;
    private previousWordsY: number = 0;
    private hud!: HUD;
    private ghostText?: Phaser.GameObjects.Text;

    // New properties for infinite game mode
    private mobs: Phaser.GameObjects.Group = null!;
    private mobSpeed: number = 220; // Base speed, will scale with world progression
    private spawnInterval: number = 1200; // ms, will scale with world progression
    private mobsRemaining: number = 30; // Will scale with world progression
    private totalMobs: number = 30;

    private health: number = 100;
    private combo: number = 0;
    private maxCombo: number = 0;
    private isGameOver: boolean = false;
    private player!: Phaser.GameObjects.Rectangle;
    private spawnTimer: number = 0;

    // Utility to get all worlds and levels
    private currentWorld: any;
    private currentLevel: any;

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
        this.hud = new HUD(this, { minWords: this.minWords, minWPM: this.minWPM, minAccuracy: this.minAccuracy });

        // Player object (visual only, left side)
        const { width, height } = this.scale;
        this.player = this.add.rectangle(60, height / 2, 48, 48, 0x44aaff, 1).setOrigin(0.5);
        this.player.setStrokeStyle(4, 0xffffff);

        // Mobs group
        this.mobs = this.add.group();
        this.mobsRemaining = this.totalMobs;
        // Input events
        this.input.keyboard?.on('keydown', this.handleKey, this);
        // Show mobs remaining in HUD
        this.hud.goalText?.setText(`Mobs Left: ${this.mobsRemaining}`);

        // Determine current world and level from levelConfig
        const found = getCurrentWorldAndLevel(this.levelConfig.id) || {};
        this.currentWorld = (found as any).world;
        this.currentLevel = (found as any).level;

        // Difficulty scaling based on world progression
        const progression = getProgression();
        let difficultyScale = 1;
        if (this.currentWorld && progression) {
            const completed = Object.keys(progression).filter(k => k.startsWith(this.currentWorld.id) && progression[k]).length;
            difficultyScale = 1 + completed * 0.15;
        }
        this.mobSpeed = 220 * difficultyScale;
        this.spawnInterval = Math.max(600, 1200 - 80 * (difficultyScale - 1));
        this.totalMobs = Math.round(30 * difficultyScale);
        this.mobsRemaining = this.totalMobs;
        this.hud.goalText?.setText(`Mobs Left: ${this.mobsRemaining}`);
    }

    update(time: number, delta: number) {
        if (this.isGameOver) return;
        // Spawn mobs only if there are mobs left to spawn
        if (this.mobsRemaining > 0) {
            this.spawnTimer += delta;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnMob();
                this.spawnTimer = 0;
                // Ramp up difficulty
                if (this.spawnInterval > 300) this.spawnInterval -= 8;
                this.mobSpeed += 1.2;
                this.mobsRemaining--;
                this.hud.goalText?.setText(`Mobs Left: ${this.mobsRemaining}`);
            }
        }
        // Move mobs
        const mobsArr = this.mobs.getChildren() as Phaser.GameObjects.Text[];
        let nearestIdx = -1;
        let minDist = Infinity;
        mobsArr.forEach((mob, i) => {
            mob.x += (mob.getData('vx') * delta) / 1000;
            mob.y += (mob.getData('vy') * delta) / 1000;
            // Find nearest mob to player
            const dist = Phaser.Math.Distance.Between(mob.x, mob.y, this.player.x, this.player.y);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = i;
            }
        });
        mobsArr.forEach((mob, i) => {
            // Highlight only the nearest mob
            if (i === nearestIdx) {
                mob.setStyle({ backgroundColor: '#ff0', color: '#000' });
                mob.setDepth(2);
            } else {
                // Use a subtle highlight for others
                mob.setStyle({ backgroundColor: 'rgba(34,34,34,0.7)', color: mob.getData('type') === 'hidden' ? '#ff44cc' : mob.getData('type') === 'strong' ? '#44eaff' : '#fff' });
                mob.setDepth(1);
            }
            // Update display for strong/hidden mobs
            const mobString = mob.getData('mobString');
            const idx = mob.getData('currentIndex') || 0;
            const type = mob.getData('type');
            const visibleCount = mob.getData('visibleCount');
            let display = '';
            if (type === 'hidden') {
                // Hidden mobs: show nothing for untyped, color for active, normal for completed
                for (let j = 0; j < mobString.length; j++) {
                    if (j < idx) display += mobString[j];
                    else display += ' ';
                }
                mob.setStyle({ color: i === nearestIdx ? '#000' : '#ff44cc' });
            } else if (type === 'strong') {
                // Strong mobs: show visibleCount, fade out completed
                for (let j = 0; j < mobString.length; j++) {
                    if (j < idx) display += ' ';
                    else if (j < visibleCount) display += mobString[j];
                    else display += ' ';
                }
                // Set alpha for completed letters
                mob.setAlpha(1);
                if (idx > 0) {
                    // Use a faded color for completed
                    mob.setStyle({ color: '#bbb' });
                } else {
                    mob.setStyle({ color: i === nearestIdx ? '#000' : '#44eaff' });
                }
            } else {
                // Normal mobs: show all, highlight current
                for (let j = 0; j < mobString.length; j++) {
                    if (j < idx) display += ' ';
                    else display += mobString[j];
                }
                mob.setStyle({ color: i === nearestIdx ? '#000' : '#fff' });
            }
            mob.setText(display);
            // If mob reaches player
            if (Phaser.Math.Distance.Between(mob.x, mob.y, this.player.x, this.player.y) < 40 && !mob.getData('reached')) {
                mob.setData('reached', true);
                this.mobReachedPlayer(mob);
            }
        });
        // Check for level completion
        if (this.mobsRemaining === 0 && this.mobs.getLength() === 0 && !this.isGameOver) {
            this.isGameOver = true;
            this.showLevelComplete();
        }
    }

    private handleKey(event: KeyboardEvent) {
        if (this.isGameOver) return;
        const mobsArr = this.mobs.getChildren() as Phaser.GameObjects.Text[];
        if (mobsArr.length === 0) return;
        // Only allow typing on the nearest mob
        let nearestIdx = -1;
        let minDist = Infinity;
        mobsArr.forEach((mob, i) => {
            const dist = Phaser.Math.Distance.Between(mob.x, mob.y, this.player.x, this.player.y);
            if (dist < minDist) {
                minDist = dist;
                nearestIdx = i;
            }
        });
        const mob = mobsArr[nearestIdx];
        if (!mob) return;
        const mobString = mob.getData('mobString');
        let idx = mob.getData('currentIndex') || 0;
        const type = mob.getData('type');
        // Case sensitive typing
        if (event.key === mobString[idx]) {
            idx++;
            mob.setData('currentIndex', idx);
            if (idx >= mobString.length) {
                this.destroyMob(mob, true);
            }
        } else {
            // Optionally: feedback for wrong key
        }
    }

    private destroyMob(mob: Phaser.GameObjects.Text, correct: boolean) {
        this.mobs.remove(mob, true, true);
        mob.destroy();
    }

    private mobReachedPlayer(mob: Phaser.GameObjects.Text) {
        this.health -= 10;
        this.hud.updateHealth(this.health);
        this.destroyMob(mob, false);
        if (this.health <= 0) {
            this.isGameOver = true;
            this.hud.showGameOver(this.score, this.maxCombo);
        }
    }

    private spawnMob() {
        // define screen bounds and random spawn Y
        const { width, height } = this.scale;
        const y = Phaser.Math.Between(50, height - 50);

        let mobType = 'normal';
        let mobString = Phaser.Utils.Array.GetRandom(this.letters);
        let visibleCount = 1;
        if (Math.random() < 0.25) {
            mobType = 'strong';
            const len = Phaser.Math.Between(2, 4);
            mobString = '';
            for (let i = 0; i < len; i++) mobString += Phaser.Utils.Array.GetRandom(this.letters);
            visibleCount = Phaser.Math.Between(1, len - 1);
        } else if (Math.random() < 0.15) {
            mobType = 'hidden';
            const len = Phaser.Math.Between(2, 4);
            mobString = '';
            for (let i = 0; i < len; i++) mobString += Phaser.Utils.Array.GetRandom(this.letters);
            visibleCount = 0;
        }
        // calculate velocity toward player
        const dx = this.player.x - (width + 40);
        const dy = this.player.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / dist) * this.mobSpeed;
        const vy = (dy / dist) * this.mobSpeed;

        // build display text
        let display = '';
        for (let i = 0; i < mobString.length; i++) {
            display += i < visibleCount ? mobString[i] : ' ';
        }

        const mob = this.add.text(width + 40, y, display, {
            fontFamily: 'Arial Black',
            fontSize: '40px',
            color: mobType === 'hidden' ? '#ff44cc' : mobType === 'strong' ? '#44eaff' : '#fff',
            backgroundColor: '#222',
            align: 'center',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        mob.setData('mobString', mobString);
        mob.setData('currentIndex', 0);
        mob.setData('type', mobType);
        mob.setData('visibleCount', visibleCount);
        mob.setData('vx', vx);
        mob.setData('vy', vy);
        mob.setData('reached', false);
        this.mobs.add(mob);
    }

    // Show level complete instead of game over
    private showLevelComplete() {
        // Unlock next level in progression
        const progression = getProgression();
        const world = (window as any).currentWorldId || 'world-1-index';
        const worldLevels = (window as any).currentWorldLevels || [];
        const idx = worldLevels.findIndex((l: any) => l.id === this.levelConfig.id);
        if (idx >= 0 && idx + 1 < worldLevels.length) {
            progression[worldLevels[idx + 1].id] = true;
            setProgression(progression);
        }
        // Show level complete UI
        const { width, height } = this.scale;
        this.add.rectangle(width / 2, height / 2, 400, 200, 0x222244, 0.95).setOrigin(0.5);
        this.add.text(width / 2, height / 2 - 40, 'Level Complete!', {
            fontFamily: 'Arial', fontSize: '40px', color: '#fff', align: 'center', stroke: '#222', strokeThickness: 4
        }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 + 10, `Score: ${this.score}`, {
            fontFamily: 'Arial', fontSize: '28px', color: '#ffff00', align: 'center', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);
        // Continue button
        const continueButton = this.add.rectangle(width / 2, height / 2 + 70, 180, 48, 0x44aaff, 1).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.add.text(width / 2, height / 2 + 70, 'Next Level', {
            fontFamily: 'Arial', fontSize: '24px', color: '#fff', align: 'center'
        }).setOrigin(0.5);
        continueButton.on('pointerdown', () => {
            if (idx >= 0 && idx + 1 < worldLevels.length) {
                this.scene.start('GameScene', { levelConfig: worldLevels[idx + 1] });
            } else {
                this.scene.start('LevelSelectScene');
            }
        });
    }
}

// Utility to get all worlds and levels
const worlds = [World1Index, World2Middle, World3Ring, World4Pinky];
function getCurrentWorldAndLevel(levelId: string) {
  for (const world of worlds) {
    const level = world.levels.find(l => l.id === levelId);
    if (level) return { world, level };
  }
  return null;
}

// Contains AI-generated edits.
