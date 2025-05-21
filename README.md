# Typer Drive

Typer Drive is a fast-paced typing game where you defeat enemy mobs by typing words and letters quickly and accurately. Built with Phaser 3, TypeScript, and Vite.

## Features
- Responsive typing mechanics
- Multiple mob types and boss fights
- **Dynamic mob registry/factory:** Easily add new mob types by registering them with the MobRegistry. Mobs are instantiated dynamically at runtime based on configuration or wave logic.
- Level and world progression
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

## Recent Improvements
- Input handling in TypingInputHandler and Mob.onTyped has been profiled and optimized for minimal latency and allocations.
- **Unit tests for TypingInputHandler and MobSpawner have been added to ensure robust input handling and mob spawning.**
- **MobRegistry and dynamic mob instantiation:** Mob types are now registered and instantiated via a central registry/factory, making it easy to add new mob types without modifying the spawner logic.
- MobSpawner's update and mob lifecycle management is being reviewed for efficiency and memory safety.
- State transitions (mob destruction, phase changes) are being made atomic and safe.
- Code comments and documentation are being updated for maintainability.

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

## Contributing
Pull requests and suggestions are welcome!

Contains AI-generated edits.
