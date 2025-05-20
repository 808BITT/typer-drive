// AssetLoader.ts
//
// Usage:
//   import AssetLoader from '../utils/AssetLoader';
//   AssetLoader.loadAssets(this);
//
// Add or modify assets in the static 'assets' array below.
//
import Phaser from 'phaser';

interface AssetDefinition {
    key: string;
    path: string;
}

export default class AssetLoader {
    // List your assets here
    private static assets: AssetDefinition[] = [
        { key: 'ship', path: 'assets/ship.png' },
        { key: 'explosion', path: 'assets/explosion.png' }
    ];

    /**
     * Loads all assets using the Phaser loader.
     * @param scene The Phaser.Scene to load assets into.
     */
    static loadAssets(scene: Phaser.Scene) {
        this.assets.forEach(asset => {
            if (!asset.key || !asset.path) {
                console.warn(`[AssetLoader] Missing key or path for asset:`, asset);
                return;
            }
            // You can add more file type checks here if needed
            if (asset.path.endsWith('.png') || asset.path.endsWith('.jpg')) {
                scene.load.image(asset.key, asset.path);
            } else if (asset.path.endsWith('.json')) {
                scene.load.json(asset.key, asset.path);
            } else {
                console.warn(`[AssetLoader] Unknown asset type for:`, asset);
            }
        });
    }
}

// Contains AI-generated edits.