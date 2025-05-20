// LevelSelectScene displays a list of available levels for the player to choose from
// Auto-generated on 2025-05-19

import { IndexLevelConfig } from '@/levels/IndexLevel';
import { MiddleLevelConfig } from '@/levels/MiddleLevel';
import { PinkyLevelConfig } from '@/levels/PinkyLevel';
import { RingLevelConfig } from '@/levels/RingLevel';
import Phaser from 'phaser';

/**
 * LevelSelectScene - Lets the player pick a level to play.
 */
export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
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

        // List of available levels
        const levels = [
            IndexLevelConfig,
            MiddleLevelConfig,
            RingLevelConfig,
            PinkyLevelConfig
        ];
        const buttonSpacing = 60;
        const buttonWidth = 260;
        const buttonHeight = 48;
        const fontColor = '#fff';
        const buttonColor = 0x1e2a38;
        const buttonHoverColor = 0x2d3e50;

        levels.forEach((level, idx) => {
            const y = height / 2 - buttonSpacing + idx * buttonSpacing;
            const button = this.add.rectangle(width / 2, y, buttonWidth, buttonHeight, buttonColor, 1)
                .setInteractive({ useHandCursor: true })
                .setOrigin(0.5);
            this.add.text(width / 2, y, level.name, {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: fontColor,
                align: 'center'
            }).setOrigin(0.5);

            button.on('pointerover', () => button.setFillStyle(buttonHoverColor));
            button.on('pointerout', () => button.setFillStyle(buttonColor));
            button.on('pointerdown', () => {
                // Start the GameScene and pass the selected level config
                this.scene.start('GameScene', { levelConfig: level });
            });
        });
    }
}
