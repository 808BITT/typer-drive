# Asset Loader Utility

Generate an asset loader for game assets.

- **Inputs:**
  - `assets` (array): list of asset definitions, e.g., [{ key: 'ship', path: 'assets/ship.png' }, { key: 'explosion', path: 'assets/explosion.png' }]
- **Desired Output:**
  - A TypeScript file `AssetLoader.ts` with a static `loadAssets(scene: Phaser.Scene)` method
  - Calls to `scene.load` for each asset definition
  - Proper error handling or log messages for missing assets
