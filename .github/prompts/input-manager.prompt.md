# Input Manager

Create an input manager for handling keyboard events.

- **Inputs:**
  - `keys` (array): list of keys to watch, e.g., ['W', 'A', 'S', 'D', 'SPACE']
- **Desired Output:**
  - A TypeScript file `InputManager.ts` with:
    - A `create(scene: Phaser.Scene)` method that sets up `scene.input.keyboard.addKeys`
    - Methods like `isKeyDown(key: string): boolean`
    - Examples of polling or subscribing to key events
