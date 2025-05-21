# How to Add a New Mob Type

This guide explains how to add a new mob (enemy) type to Typer Drive, including subclassing, configuration, and registration.

## 1. Create a Mob Class
- Go to `client/src/mobs/`.
- Create a new class that extends `BaseMob` (see `Mob.ts`).
- Implement custom behavior, visuals, or effects as needed.

**Example:**
```ts
import { BaseMob, MobConfig } from './Mob';

export class MyCustomMob extends BaseMob {
  constructor(config: MobConfig) {
    super(config);
    // Custom initialization
  }
  // Override methods for custom behavior
}
```

## 2. Register the Mob Type
- Open `client/src/mobs/MobTypes.ts`.
- Import your new mob class.
- Add it to the export list or mob registry as needed.

**Example:**
```ts
import { MyCustomMob } from './MyCustomMob';
export { MyCustomMob, ... };
```

## 3. Configure Mob Spawning
- In `client/src/mobs/MobSpawner.ts`, update the logic to support your new mob type if needed.
- Add your mob to the spawn logic, config, or registry.
- Optionally, update `WaveConfig` or level configs to include your mob.

**Example:**
```ts
import { MyCustomMob } from './MobTypes';
// In MobSpawner logic:
if (type === 'myCustom') {
  mob = new MyCustomMob(config);
}
```

## 4. Update Level Configs (Optional)
- To spawn your mob in a level, update the relevant level config in `client/src/levels/`.
- Add your mob type to the `letters` or `mobs` array as appropriate.

---

**Summary:**
1. Subclass `BaseMob` for new behavior.
2. Register in `MobTypes.ts`.
3. Update `MobSpawner.ts` to support spawning.
4. Reference in level configs as needed.

Contains AI-generated edits.
