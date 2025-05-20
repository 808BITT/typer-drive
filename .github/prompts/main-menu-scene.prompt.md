# Main Menu Scene Creation

Create a Phaser scene for the main menu.

- **Inputs:**
  - `sceneKey` (string): e.g., "MainMenu"
  - `options` (object): buttons and their target scenes, e.g., [{ text: 'Start', target: 'BootScene' }, { text: 'Settings', target: 'SettingsScene' }]
- **Desired Output:**
  - A TypeScript file `MainMenuScene.ts` extending `Phaser.Scene`
  - Preload and create methods setting up UI buttons
  - Button click handlers transitioning to specified scenes
  - Consistent styling and font usage from project standards
