import Phaser from 'phaser';

/**
 * SceneTransition handles animated transitions between scenes.
 * Usage: call SceneTransition.fadeToScene(this, 'TargetScene', data)
 */
export class SceneTransition {
    /**
     * Fades out the current scene, then starts the target scene with a fade-in.
     * @param scene The current Phaser.Scene
     * @param targetSceneKey The key of the scene to start
     * @param data Optional data to pass to the new scene
     * @param duration Fade duration in ms (default 400)
     */
    static fadeToScene(scene: Phaser.Scene, targetSceneKey: string, data?: any, duration: number = 400) {
        const { width, height } = scene.sys.game.canvas;
        const fadeRect = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0).setDepth(1000);
        scene.tweens.add({
            targets: fadeRect,
            alpha: 1,
            duration,
            onStart: () => fadeRect.setAlpha(0),
            onUpdate: (tween, target) => {
                fadeRect.setAlpha(tween.progress);
            },
            onComplete: () => {
                scene.scene.start(targetSceneKey, data);
                // Fade in on new scene
                scene.scene.get(targetSceneKey).cameras.main.fadeIn(duration, 0, 0, 0);
            }
        });
    }
}

// Contains AI-generated edits.
