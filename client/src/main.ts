import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { LevelSceneIndex1 } from './scenes/LevelSceneIndex1';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { WorldSelectScene } from './scenes/WorldSelectScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: [BootScene, MainMenuScene, WorldSelectScene, LevelSelectScene, GameScene, LevelSceneIndex1]
};

window.addEventListener('load', () => {
    new Phaser.Game(config);
});