### Mobs & Extensibility
1. Refactor mob logic so new mob types can be added via configuration or subclassing. <!-- COMPLETED: MobSpawner now supports both letter and word mobs, configurable by percentage. -->
2. Document the process for adding new mobs (base class, config, registration). <!-- COMPLETED: See docs/adding-mobs.md for full guide. -->
3. Implement a mob registry/factory for dynamic mob instantiation. <!-- COMPLETED: MobRegistry enables dynamic registration and instantiation of mob types. -->
4. Add unique behaviors and visuals for each mob type (e.g., armored, shielded, boss).
5. Support for word-based and letter-based mobs. <!-- COMPLETED: Word-based mobs and percentage-based spawning implemented. -->

### Level & World Design
1. Expand level definitions to support custom rules, win conditions, and boss fights.
2. Add world/level progression with unlocks and save/load progression.
3. Create a level editor or config-driven level creation.

### Core Gameplay & Polish
1. Add or improve tests for typing accuracy and responsiveness.
2. Add combo/multiplier system for consecutive correct typings.
3. Create a pause menu and game over screen with stats.
4. Add a tutorial/intro level for new players.

### UI/UX Improvements
1. Polish HUD: show score, combo, health, and level progress.
2. Add animated transitions between scenes and levels.
3. Improve accessibility (color contrast, font size, input remapping).
4. Add sound/music controls.

### Audio & Visuals
1. Add background music and sound effects for actions/events.
2. Enhance mob and background animations.
3. Add particle effects for typing streaks, mob defeat, and level completion.

### Future Features (Optional)
1. Add power-ups or special abilities.
2. Implement multiplayer or leaderboard features.
3. Support for custom word lists or user-generated content.

- [x] Add visual and audio feedback for correct/incorrect keypresses.

### Modularization for Future Expansion
1. Refactor mob system for modularity (base class, types, spawner, input handler)
2. Refactor level system for modularity (level configs, world groupings)
3. Refactor UI/HUD for modularity (HUD, HUDScene, UI components)
4. Ensure scalable imports/usage in main.ts and scenes
5. Update README.md to document modular structure
6. Mark this modularization task as completed

- Modularization for future expansion (mobs, levels, UI) is complete. The codebase now uses a modular structure:
  - All mob types inherit from a base class and are registered in a central module for easy addition.
  - Level configs are separated and grouped for scalable world/level design.
  - UI/HUD logic is modularized for extension and reuse.
  - Main scenes import and use these modules for scalable game logic.
  - See README.md for details on extending mobs, levels, or UI.

<!-- Contains AI-generated edits -->
