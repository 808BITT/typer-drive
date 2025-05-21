### Core Gameplay & Polish
1. Refine core typing mechanics for responsiveness and accuracy.
2. ~~Add visual and audio feedback for correct/incorrect keypresses.~~
3. Implement smooth difficulty scaling (mob speed, spawn rate, word complexity).
    - 3.1. ~~Implement dynamic mob speed scaling based on elapsed time or score.~~ <!-- COMPLETED: Mob speed now increases smoothly with progression in GameScene and MobSpawner. -->
    - 3.2. Implement spawn interval reduction (faster spawns) as difficulty increases.
    - 3.3. Increase word complexity (longer or less common words) as difficulty increases.
    - 3.4. Integrate scaling logic into MobSpawner and relevant scenes.
    - 3.5. Playtest and balance scaling parameters for smooth progression.
4. Add combo/multiplier system for consecutive correct typings.
5. Create a pause menu and game over screen with stats.
6. Add a tutorial/intro level for new players.

### Mobs & Extensibility
1. Refactor mob logic so new mob types can be added via configuration or subclassing. <!-- COMPLETED: MobSpawner now supports both letter and word mobs, configurable by percentage. -->
2. Document the process for adding new mobs (base class, config, registration).
3. Implement a mob registry/factory for dynamic mob instantiation.
4. Add unique behaviors and visuals for each mob type (e.g., armored, shielded, boss).
5. Support for word-based and letter-based mobs. <!-- COMPLETED: Word-based mobs and percentage-based spawning implemented. -->

### Level & World Design
1. Expand level definitions to support custom rules, win conditions, and boss fights.
2. Add world/level progression with unlocks and save/load progression.
3. Create a level editor or config-driven level creation.

### UI/UX Improvements
1. Polish HUD: show score, combo, health, and level progress.
2. Add animated transitions between scenes and levels.
3. Improve accessibility (color contrast, font size, input remapping).
4. Add sound/music controls.

### Audio & Visuals
1. Add background music and sound effects for actions/events.
2. Enhance mob and background animations.
3. Add particle effects for typing streaks, mob defeat, and level completion.

### Code Quality & Maintainability
1. Ensure all code is well-commented and follows project conventions.
2. Write unit/integration tests for core systems (mob spawning, input handling).
3. Modularize code for easy future expansion (mobs, levels, UI).
4. Keep project layout and documentation up to date.

### Future Features (Optional)
1. Add power-ups or special abilities.
2. Implement multiplayer or leaderboard features.
3. Support for custom word lists or user-generated content.

- [x] Add visual and audio feedback for correct/incorrect keypresses.
