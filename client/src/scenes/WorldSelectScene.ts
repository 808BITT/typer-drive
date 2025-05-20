// WorldSelectScene.ts
// Lets the player pick a world (Index, Middle, Ring, Pinky)
import { World1Index } from '@/levels/World1Index';
import Phaser from 'phaser';

const worlds = [
    World1Index,
    // TODO: Add other worlds (Middle, Ring, Pinky) when ready
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
            const button = this.add.rectangle(width / 2, y, buttonWidth, buttonHeight, buttonColor, 1)
                .setInteractive({ useHandCursor: true })
                .setOrigin(0.5);
            this.add.text(width / 2, y, world.name, {
                fontFamily: 'Arial',
                fontSize: '26px',
                color: fontColor,
                align: 'center'
            }).setOrigin(0.5);
            button.on('pointerover', () => button.setFillStyle(buttonHoverColor));
            button.on('pointerout', () => button.setFillStyle(buttonColor));
            button.on('pointerdown', () => {
                this.scene.start('LevelSelectScene', { worldId: world.id });
            });
        });
    }
}
