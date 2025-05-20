// WorldSelectScene.ts
// Lets the player pick a world (Index, Middle, Ring, Pinky)
import { World1Index } from '@/levels/World1Index';
import { World2Middle } from '@/levels/World2Middle';
import { World3Ring } from '@/levels/World3Ring';
import { World4Pinky } from '@/levels/World4Pinky';
import Phaser from 'phaser';

const worlds = [
    World1Index,
    World2Middle,
    World3Ring,
    World4Pinky,
    // TODO: Add other worlds (Pinky) when ready
];

export class WorldSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldSelectScene' });
    }

    create() {
        const { width, height } = this.scale;
        this.add.text(width / 2, 80, 'Select a World', {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: '#fff',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#222',
            strokeThickness: 4
        }).setOrigin(0.5);

        const buttonSpacing = 70;
        const buttonWidth = 340;
        const buttonHeight = 50;
        const fontColor = '#fff';
        const buttonColor = 0x1e2a38;
        const buttonHoverColor = 0x2d3e50;

        worlds.forEach((world, idx) => {
            const y = 180 + idx * buttonSpacing;
            // Check if world is unlocked
            let unlocked = false;
            if (idx === 0) {
                unlocked = true; // World 1 always unlocked
            } else if (idx === 1) {
                // World 2 unlocked if World 1 completed
                unlocked = localStorage.getItem('world-1-index-completed') === 'true';
            } else if (idx === 2) {
                // World 3 unlocked if World 2 completed
                unlocked = localStorage.getItem('world-2-middle-completed') === 'true';
            } else if (idx === 3) {
                // World 4 unlocked if World 3 completed
                unlocked = localStorage.getItem('world-3-ring-completed') === 'true';
            }
            // Add button
            const button = this.add.rectangle(width / 2, y, buttonWidth, buttonHeight, unlocked ? buttonColor : 0x444444, 1)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: unlocked });
            // Add lock icon if locked
            if (!unlocked) {
                this.add.text(width / 2 - buttonWidth / 2 + 28, y, '🔒', {
                    fontFamily: 'Arial',
                    fontSize: '26px',
                    color: '#aaa',
                    align: 'center'
                }).setOrigin(0.5);
            }
            // Add world name
            this.add.text(width / 2, y, world.name, {
                fontFamily: 'Arial',
                fontSize: '26px',
                color: unlocked ? fontColor : '#888',
                align: 'center'
            }).setOrigin(0.5);
            button.on('pointerover', () => {
                if (unlocked) button.setFillStyle(buttonHoverColor);
            });
            button.on('pointerout', () => button.setFillStyle(unlocked ? buttonColor : 0x444444));
            button.on('pointerdown', () => {
                if (unlocked) {
                    this.scene.start('LevelSelectScene', { worldId: world.id });
                }
            });
        });
    }
}
