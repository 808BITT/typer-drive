# Typer Drive

Typer Drive is a fast-paced typing game where you defeat enemy mobs by typing words and letters quickly and accurately. Built with Phaser 3, TypeScript, and Vite.

## Features
- Fast-paced typing action with procedurally generated waves
- Multiple enemy mob types with unique behaviors
- Advanced mob spawning: All mob types are now incorporated and spawn randomly with weighted probabilities
- Power-ups, upgrades, and unlockable cosmetics
- Dynamic soundtrack and SFX
- Responsive typing mechanics
- Multiple mob types and boss fights
- **Dynamic mob registry/factory:** Easily add new mob types by registering them with the MobRegistry. Mobs are instantiated dynamically at runtime based on configuration or wave logic.
- **Level and world progression with unlocks and save/load:** Progress through levels and worlds, unlocking new content as you complete challenges. Your progression is automatically saved and loaded using localStorage, so you can continue where you left off.
- Combo/multiplier system
- Animated HUD and stats
- **Visual and audio feedback for correct/incorrect keypresses**
- Particle effects and celebratory animations
- Sound effects for actions and events
- Background music
- Pause menu, game over, and victory screens
- Tutorial/intro level for new players
- **Smooth difficulty scaling:** Mob speed, spawn rate (interval reduces smoothly per wave and ramps up in endless mode), and word complexity increase as you progress for a dynamic challenge.
- **Dynamic word complexity:** As difficulty increases, mobs use longer and less common words, making the challenge scale smoothly for all skill levels.
- **Optimized TypingInputHandler for minimal input latency and robust correctness**
- **Animated transitions between scenes and levels**

## Recent Improvements
- Input handling in TypingInputHandler and Mob.onTyped has been profiled and optimized for minimal latency and allocations.
- **Unit tests for TypingInputHandler and MobSpawner have been added to ensure robust input handling and mob spawning.**
- **MobRegistry and dynamic mob instantiation:** Mob types are now registered and instantiated via a central registry/factory, making it easy to add new mob types without modifying the spawner logic.
- MobSpawner's update and mob lifecycle management is being reviewed for efficiency and memory safety.
- State transitions (mob destruction, phase changes) are being made atomic and safe.
- Code comments and documentation are being updated for maintainability.
- **Scene consolidation in progress:** We are auditing and refactoring `GameplayScene`, `GameScene`, and `MobGameScene` to eliminate redundancy and clarify their roles. See TODO.md for details.

## Getting Started
1. `cd client && npm install`
2. `npm run dev` to start the frontend
3. `cd ../server && go run main.go` to start the backend

## Audio & Visual Feedback
- Correct keypress: Green flash near the player ship and a satisfying 'hit' sound
- Incorrect keypress: Red flash and a 'miss' sound
- All audio is preloaded in the main gameplay scene

## Project Structure
See `.github/instructions/project_layout.instructions.md` for a detailed layout.

## Modular Architecture

Typer Drive is organized for easy expansion:
- **Mobs:** All mob types inherit from a `BaseMob` class (`client/src/mobs/Mob.ts`). New mobs can be added by subclassing and registering in `MobTypes.ts`.
- **Mob Spawner:** `MobSpawner.ts` supports configurable mob types and spawning logic.
- **Levels:** Level configs are defined in `client/src/levels/` and grouped into worlds (e.g., `World1Index.ts`).
- **UI/HUD:** UI logic is modularized into `HUD.ts`, `HUDScene.ts`, and related components for easy extension.
- **Scenes:** Game scenes import and use these modules for scalable game logic.

To add new mobs, levels, or UI components:
1. **Mobs:** Create a new class extending `BaseMob` and register it in `MobTypes.ts`.
2. **Levels:** Add a new config file in `client/src/levels/` and group as needed.
3. **UI:** Extend or add new UI components in `entities/` or `scenes/` as appropriate.

See `.github/instructions/project_layout.instructions.md` for a full directory breakdown.

## Mob Extensibility & Adding New Mobs

See [`docs/adding-mobs.md`](docs/adding-mobs.md) for a step-by-step guide to adding new mob types, including subclassing, configuration, and registration in the game.

## Unique Mob Behaviors & Visuals
Each mob type features distinct gameplay mechanics and visual effects:
- **NormalLetterMob:** Standard mob, destroyed on correct letter.
- **TankWordMob:** Requires typing a full word, each letter removes part of the mob.
- **ArmoredLetterMob:** Has an armor layer; first correct key breaks armor, second destroys mob. Armor is visually indicated.
- **ShieldedWordMob:** Protected by a shield that must be broken with a special key (e.g., '#') before typing the word. Shield is visually indicated.
- **RegeneratorMob:** Regenerates previously removed letters if not destroyed quickly. Visual regeneration effect.
- **SplitWordMob:** Splits into two mobs halfway through typing. Split effect and new mobs appear.
- **SpeedsterMob:** Moves at double speed, higher points.
- **BossMob:** Multi-phase, with unique visuals and a health bar for each phase. Phase transitions have special effects.

See `client/src/mobs/MobTypes.ts` for implementation details.

## Level System Enhancements

- Level definitions now support custom rules (e.g., time limits, special restrictions).
- Each level can define a win condition (score, time, defeat boss, or custom).
- Boss fights are supported with a dedicated bossConfig object in the level definition.

## Level & World Progression

- Levels are grouped into worlds (see `client/src/levels/World*`).
- Completing a level unlocks the next level in the world.
- Completing the last level in a world unlocks the next world.
- Locked levels and worlds are visually indicated in the UI.
- Progression is saved and loaded automatically using localStorage.
- You can replay any unlocked level or world at any time.

## Testing

### Typing Accuracy & Responsiveness
- The `TypingInputHandler` is covered by a comprehensive suite of unit tests (`client/tests/TypingInputHandler.test.ts`).
- Tests ensure:
  - Correct mob receives input based on position and activity.
  - Inactive mobs are ignored for accuracy.
  - Rapid sequential key presses are handled for responsiveness.
  - Miss and typed callbacks are triggered appropriately.
- These tests help guarantee robust, low-latency input handling and accurate gameplay feedback.

## Contributing
Pull requests and suggestions are welcome!

Contains AI-generated edits.

## SPA Routing Support

The Go server is configured to serve `index.html` for all non-file requests, enabling client-side routing and allowing the game to load correctly on page refresh or direct navigation to any route.
