### Core Gameplay & Polish
1. [x] Add combo/multiplier system for consecutive correct typings.
    - Track current combo and max combo in GameScene.
    - Increment combo on each correct typing, reset on miss.
    - Apply score multiplier based on combo streak (e.g., every 10 combo = +1x multiplier).
    - Display current combo and multiplier in HUD.
    - Emit and handle events for combo updates between TypingInputHandler, GameScene, and HUD/HUDScene.
    - Test combo resets and multiplier scoring.
2. [x] Add a pause menu and game over screen with stats.
3. Add a tutorial/intro level for new players.

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
- [ ] Add visual feedback for progression (locked/unlocked levels and worlds)
    - [x] Show locked/unlocked states for levels in LevelSelectScene (e.g., grayed out, lock icon, or disabled button)
    - [ ] Show locked/unlocked states for worlds in WorldSelectScene
    - [ ] Add notification or animation in GameScene/HUD when a new level/world is unlocked
    - [ ] Test progression feedback and polish UI

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
