# Typer Drive AAA Game Roadmap

## Core Gameplay & Systems
- [ ] Cinematic intro sequence with animated logo and story setup.
- [ ] Fully animated tutorial/intro level with voiceover and interactive prompts.
- [ ] Deep progression system: unlockable ships, abilities, and cosmetic upgrades.
- [ ] Advanced HUD: animated, modular, with dynamic effects and transitions.
- [ ] Accessibility: colorblind modes, scalable UI, remappable controls, subtitles.
- [ ] In-game settings menu: audio, video, controls, accessibility, language.
- [ ] Save system: cloud sync, multiple profiles, achievements.
- [ ] Multiplayer: online co-op and versus modes, matchmaking, leaderboards.
- [ ] Dynamic events: boss raids, time-limited challenges, seasonal content.
- [ ] Extensive localization (i18n) with professional translations.
- [ ] Mobile and console support: touch, controller, and adaptive UI.

## Visuals & Animation
- [ ] High-fidelity animated backgrounds for each world (parallax, weather, effects).
- [ ] Unique, fully animated mob/enemy sprites for each type and world.
- [ ] Player ship: 3D-rendered sprite with idle, boost, damage, and destruction animations.
- [ ] Bosses: multi-phase, multi-part animated sprites with VFX and telegraphed attacks.
- [ ] Particle systems: explosions, typing streaks, power-ups, environmental effects.
- [ ] Cinematic transitions: level start/end, boss intro, world unlock, game over.
- [ ] UI/UX: animated menus, buttons, popups, and notifications.

## Audio
- [ ] Original soundtrack: unique themes for each world, boss, and menu.
- [ ] Dynamic music system: layers and transitions based on gameplay intensity.
- [ ] SFX: custom sounds for typing, hits, misses, power-ups, UI, and environment.
- [ ] Voiceover: narrator, character lines, and tutorial guidance.

## Content & Narrative
- [ ] Story mode: branching narrative, cutscenes, and character progression.
- [ ] World/level design: unique themes, hazards, and mechanics per world.
- [ ] Power-ups: visual and audio feedback, upgrade paths, and rarity tiers.
- [ ] Cosmetic unlocks: skins, trails, HUD themes, and emotes.

## Testing & Polish
- [ ] Automated unit, integration, and end-to-end tests.
- [ ] Playtesting and UX feedback loops.
- [ ] Performance optimization: asset streaming, memory, and frame rate.
- [ ] QA: bug tracking, crash reporting, and analytics.
- [x] Fix SPA routing in Go server: serve index.html for all non-file requests so the game loads on page refresh.

---

## Custom Asset Requirements for Graphic Artist

### Player Ship
- **Main Ship Sprite**: 512x256px, 3/4 top-down, sci-fi style, blue/white color scheme, layered for animation.
- **Idle Animation**: 8 frames, subtle engine glow and cockpit flicker.
- **Boost Animation**: 6 frames, engine flames extend, motion blur.
- **Damage Animation**: 4 frames, flicker effect, sparks, shield distortion.
- **Destruction Animation**: 12 frames, ship breaks apart, explosion, debris.

### Enemy Mobs
- **NormalLetterMob**: 128x128px, robotic drone, single glowing letter, idle and hit animation.
- **TankWordMob**: 192x128px, armored crawler, segmented body, each segment for a letter, breaking armor animation.
- **ArmoredLetterMob**: 128x128px, shielded orb, armor cracks and shatters on hit.
- **ShieldedWordMob**: 192x128px, floating glyph with energy shield, shield break VFX.
- **RegeneratorMob**: 160x128px, organic blob, regenerating tendrils, pulsing core.
- **SplitWordMob**: 160x128px, splits into two 96x96px sprites, splitting animation.
- **SpeedsterMob**: 128x96px, sleek, aerodynamic, motion blur trail.
- **BossMob**: 512x384px, multi-part, animated limbs, glowing weak points, phase transitions.

### Backgrounds & Environments
- **World 1 (Home Row)**: 1920x1080px, neon cityscape, animated lights, parallax layers (foreground, midground, background).
- **World 2 (Top Row)**: 1920x1080px, orbital station, moving satellites, starfield, animated solar flares.
- **World 3 (Bottom Row)**: 1920x1080px, alien jungle, bioluminescent plants, animated wildlife.
- **World 4 (Pinky)**: 1920x1080px, crystalline caverns, glowing crystals, falling debris.

### UI & HUD
- **HUD Panel**: 1600x200px, semi-transparent, glassmorphism, layered for animation.
- **Score/Combo/Health Icons**: 64x64px, stylized, matching overall theme.
- **Buttons**: 320x96px, 3 states (normal, hover, pressed), animated transitions.
- **Popups/Notifications**: 800x400px, modal background, animated entry/exit.

### Particles & Effects
- **Explosion**: 128x128px, 12-frame sprite sheet, fiery and electric variants.
- **Typing Streak**: 64x64px, blue/yellow streak, additive blend.
- **Power-up Pickup**: 96x96px, sparkle and burst.
- **Environmental**: 64x64px, dust, sparks, rain, snow, as needed per world.

### Cutscenes & Cinematics
- **Intro Cinematic**: Storyboard frames, 1920x1080px, 10-15 scenes, layered for parallax and animation.
- **Boss Intro/Outro**: 1920x1080px, dramatic lighting, animated overlays.

### Miscellaneous
- **World Map**: 1920x1080px, stylized, interactive nodes for each world/level.
- **Achievement Badges**: 128x128px, unique icon for each achievement.
- **Profile Avatars**: 256x256px, 12+ variations, sci-fi/alien theme.

---

<!-- Contains AI-generated edits -->

<!-- StealthLetterMob (invisible letters) has been removed from the project. -->
