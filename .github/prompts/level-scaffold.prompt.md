# Level Scaffold Generator

Generate a new Phaser scene for a typing level.

- **Inputs:**
  - `levelId` (string): e.g., "index-2"
  - `letters` (string[]): e.g., ["G", "H", "R", "U"]
  - `boss` (boolean): whether this is a boss level
- **Desired Output:**
  - A TypeScript file `LevelScene{levelId}.ts` with a Phaser.Scene subclass
  - Imports for `LevelConfig` from `@/types`
  - Comment headers matching project lint rules
