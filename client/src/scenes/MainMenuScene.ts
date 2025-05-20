import Phaser from 'phaser';

interface MenuOption {
    text: string;
    target: string;
}

/**
 * MainMenuScene displays the main menu with navigation buttons.
 *
 * Usage:
 *   new MainMenuScene('MainMenu', [
 *     { text: 'Start', target: 'BootScene' },
 *     { text: 'Settings', target: 'SettingsScene' }
 *   ])
 */
export class MainMenuScene extends Phaser.Scene {
    private options: MenuOption[];

    constructor(sceneKey = 'MainMenu', options: MenuOption[] = [
        { text: 'Level Selector', target: 'LevelSelectScene' },
        { text: 'Statistics', target: 'StatisticsScene' },
        { text: 'Settings', target: 'SettingsScene' }
    ]) {
        super({ key: sceneKey });
        this.options = options;
    }

    preload() {
        // Preload assets here if needed (e.g., logo, button images, fonts)
    }

    create() {
        const { width, height } = this.scale;
        const buttonSpacing = 60;
        const buttonWidth = 240;
        const buttonHeight = 48;
        const fontFamily = 'Arial'; // Default, update if custom font is added
        const fontColor = '#fff';
        const buttonColor = 0x1e2a38;
        const buttonHoverColor = 0x2d3e50;

        // Title
        this.add.text(width / 2, height / 2 - 120, 'Space Typing Adventure', {
            fontFamily,
            fontSize: '40px',
            color: fontColor,
            fontStyle: 'bold',
            align: 'center',
            stroke: '#222',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create menu buttons
        this.options.forEach((option, idx) => {
            const y = height / 2 - buttonSpacing + idx * buttonSpacing;
            // Button background
            const button = this.add.rectangle(width / 2, y, buttonWidth, buttonHeight, buttonColor, 1)
                .setInteractive({ useHandCursor: true })
                .setOrigin(0.5);
            // Button label
            const label = this.add.text(width / 2, y, option.text, {
                fontFamily,
                fontSize: '28px',
                color: fontColor,
                align: 'center'
            }).setOrigin(0.5);

            button.on('pointerover', () => button.setFillStyle(buttonHoverColor));
            button.on('pointerout', () => button.setFillStyle(buttonColor));
            button.on('pointerdown', () => {
                this.scene.start(option.target);
            });
        });
    }
}
