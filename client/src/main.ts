import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LevelSceneIndex1 } from './scenes/LevelSceneIndex1';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { MainMenuScene } from './scenes/MainMenuScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [BootScene, MainMenuScene, LevelSelectScene, LevelSceneIndex1]
};

window.addEventListener('load', () => {
    new Phaser.Game(config);
});