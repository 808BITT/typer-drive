### Core Gameplay & Polish
4. Update HUD and GameScene for instant feedback on typing. <!-- COMPLETED: See below for subtasks. -->
    - [x] Add HUD methods for instant feedback (flash score/combo/health, show correct/incorrect indicator).
    - [x] Update GameScene to call HUD feedback methods on keypress (correct/incorrect).
    - [x] Animate or color the typed letter/mob for instant feedback.
    - [x] Test and polish feedback effects for clarity and responsiveness.
5. Add or improve tests for typing accuracy and responsiveness.
6. Add combo/multiplier system for consecutive correct typings.
7. Create a pause menu and game over screen with stats.
8. Add a tutorial/intro level for new players.

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
