# HUD (Heads-Up Display) Scene

Create a HUD overlay scene.

- **Inputs:**
  - `elements` (array): e.g., [{ type: 'text', key: 'score', position: { x: 10, y: 10 }, initial: 'Score: 0' }, { type: 'bar', key: 'health', position: { x: 10, y: 30 }, max: 100 }]
- **Desired Output:**
  - A TypeScript file `HUDScene.ts` extending `Phaser.Scene`
  - Initialization of text and bar elements in `create()`
  - Public methods to update HUD elements (e.g., `updateScore(value: number)`)
  - Integration instructions to add the HUD scene above game scenes
