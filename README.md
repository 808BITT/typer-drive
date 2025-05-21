# Typer Drive

Typer Drive is a fast-paced typing game where you defeat enemy mobs by typing words and letters quickly and accurately. Built with Phaser 3, TypeScript, and Vite.

## Features
- Responsive typing mechanics
- Multiple mob types and boss fights
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

## Contributing
Pull requests and suggestions are welcome!

Contains AI-generated edits.
