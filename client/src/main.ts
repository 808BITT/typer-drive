import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { LevelSceneIndex1 } from './scenes/LevelSceneIndex1';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { WorldSelectScene } from './scenes/WorldSelectScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    parent: 'game-container',
    scene: [BootScene, MainMenuScene, WorldSelectScene, LevelSelectScene, GameScene, LevelSceneIndex1],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    }
};

window.addEventListener('load', () => {
    new Phaser.Game(config);
});