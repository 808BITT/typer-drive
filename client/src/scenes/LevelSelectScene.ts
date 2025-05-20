// LevelSelectScene displays a list of available levels for the player to choose from
// Auto-generated on 2025-05-19

import { World1Index } from '@/levels/World1Index';
import { World2Middle } from '@/levels/World2Middle';
import { World3Ring } from '@/levels/World3Ring';
import { World4Pinky } from '@/levels/World4Pinky';
import { getProgression } from '@/types';
import Phaser from 'phaser';

const worlds = [
    World1Index,
    World2Middle,
    World3Ring,
    World4Pinky,
];

/**
 * LevelSelectScene - Lets the player pick a level to play for a selected world.
 */
export class LevelSelectScene extends Phaser.Scene {
    private selectedWorld: any;
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    init(data: { worldId?: string }) {
        if (data && data.worldId) {
            this.selectedWorld = worlds.find(w => w.id === data.worldId) || worlds[0];
        } else {
            this.selectedWorld = worlds[0];
        }
        // Expose for GameScene progression
        (window as any).currentWorldId = this.selectedWorld.id;
        (window as any).currentWorldLevels = this.selectedWorld.levels;
    }

    create() {
        const { width, height } = this.scale;
        this.add.text(width / 2, 80, 'Select a Level', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#fff',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#222',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Show selected world name and its sub-levels
        const world = this.selectedWorld;
        const buttonSpacing = 50;
        const buttonWidth = 320;
        const buttonHeight = 40;
        const fontColor = '#fff';
        const buttonColor = 0x1e2a38;
        const buttonHoverColor = 0x2d3e50;

        this.add.text(width / 2, 150, world.name, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffff88',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#222',
            strokeThickness: 3
        }).setOrigin(0.5);

        (world.levels as any[]).forEach((level: any, idx: number) => {
            const y = 200 + idx * buttonSpacing;
            const progression = getProgression();
            const unlocked = idx === 0 || progression[level.id];
            const button = this.add.rectangle(width / 2, y, buttonWidth, buttonHeight, unlocked ? buttonColor : 0x555555, 1)
                .setInteractive({ useHandCursor: unlocked })
                .setOrigin(0.5);
            this.add.text(width / 2, y, level.name + (unlocked ? '' : ' (Locked)'), {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: unlocked ? fontColor : '#888',
                align: 'center'
            }).setOrigin(0.5);
            if (unlocked) {
                button.on('pointerover', () => button.setFillStyle(buttonHoverColor));
                button.on('pointerout', () => button.setFillStyle(buttonColor));
                button.on('pointerdown', () => {
                    this.scene.start('GameScene', { levelConfig: level });
                });
            }
        });

        // Back to World Select
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
            this.scene.start('WorldSelectScene');
        });
    }
}
