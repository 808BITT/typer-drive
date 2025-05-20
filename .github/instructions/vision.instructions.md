---
applyTo: "**"
---

1. Project Vision & Scope

The Space Typing Adventure is a browser-based, Phaser-powered touch-typing game with a space theme, teaching finger-specific lessons through gamified levels and boss fights
Nuclino
.
It targets desktop learners new to touch typing, using clear cartoon visuals and instant feedback to build muscle memory for each finger group before moving to mixed-finger challenges and optional symbol/code modes
wayline.io
.
The game is designed to be fun and engaging, with a focus on fast-paced action and a variety of typing challenges that keep players motivated to improve their skills.

2. Core Requirements

    Frameworks & Tools

        Frontend: Vite + TypeScript + Phaser 3 for fast dev and rendering performance
        Visual Studio Code
        .

        Backend: Go 1.20 HTTP server, serving static dist/ assets and reading PORT env var
        GitHub Docs
        .

    Level Structure

        Four “worlds” per finger (Index, Middle, Ring, Pinky), each with incremental levels and a final boss level using only that finger’s keys.

        Post-campaign mixed-finger challenges and expansions (numbers, symbols, code).

    Visual & Audio Style

        Minimal modern cartoon aesthetic (flat shapes, bright palette, coherent outline/no-outline style) for sprites and UI
        Nuclino
        .

        Asset loading via a centralized AssetLoader module; audio via AudioManager.

    Gameplay Mechanics

        Typing → in-game actions (racing or shooting aliens) to enforce “eyes on screen” practice.

        HUD overlay tracks score, health, WPM, updated via public methods.

    🛡️ Game Mode: Mob-Defense Typing

        Concept: Mobs march in from the right toward the player’s avatar on the left. Each mob carries one or more letters—typing them correctly destroys or weakens the mob before it reaches you. If a mob reaches the left, it damages your health bar.

        Flow:
            Spawn Wave: At set intervals, a wave of mobs is spawned at random vertical positions.
            Advance: Each mob moves left at its own speed.
            Player Action: Player types letters on the keyboard.
                • On correct letter: mob.onTyped(letter) consumes the next target.
                • On full depletion: mob destroyed with death VFX/SFX.
            Damage: Mobs reaching the left call onReachPlayer() to deduct health.
            Victory/Defeat: Survive N waves to win or health = 0 to lose.

        👾 Core Mob Types
            Type                  HP / Letters      Behavior                              Notes
            Normal Letter Mob     1 letter, 1 HP    Single character; TYPED⇒destroyed.    Base difficulty.
            Tank Word Mob         Word (3–5 letters) Each keystroke removes first letter.  High HP progression.
            Armored Letter Mob    2 letters, 2 HP    “Outer” letter reveal inner then type.  Mid-level challenge.

        ✨ New Mob Types
            Shielded Word Mob
                HP: 1 shield + Word (4–6 letters)
                Shield broken by typing “#” (or designated key), then acts like Tank Word Mob.
            Regenerator Mob
                HP: Word (3–5 letters)
                After each correct keystroke starts 1 s timer; if it expires before next keystroke, last removed letter is re-added.
            Split Word Mob
                HP: Word (6 letters)
                Typing first half splits into two 3-letter Tank Word Mobs advancing independently.
            Stealth Letter Mob
                HP: 1 letter, 1 HP
                Letter fades invisible for 0.5 s cycles; can only be typed when visible.
            Speedster Mob
                HP: 2 letters, 2 HP
                Moves at 2× speed; letters must be typed in order.
            Boss Mob (End-of-Wave)
                HP: Word/sentence (8–12 letters) + Phases
                Phase 1: Tank Word; Phase 2: Armored Letter on random letters; Phase 3: Regenerator or Speedster combo.

        ⚙️ Implementation Notes for Devs
            Mob Class Structure:
                interface MobConfig {
                  id: string;
                  letters: string[];          
                  speed: number;              
                  onTyped(letter: string): void;
                  onReachPlayer(): void;
                  render(): void;
                  update(delta: number): void;
                }
            Spawning System:
                class MobSpawner {
                  spawnInterval: number;
                  waveCount: number;
                  spawnQueue: MobConfig[];
                  startWave(): void;
                  update(time: number): void;
                }
            Typing Input Handler:
                • Listen for keydown events.
                • Keep visible mobs sorted by proximity.
                • On key press, match key to first mob.letters[0], call mob.onTyped() or miss VFX.
            Animations & VFX:
                Normal Hit: green flash; Miss: red spark; Destruction: explosion particle; Split: pop effect.
            Balancing Parameters:
                Tune speed, spawnInterval, health/letters per difficulty or wave.

3. Contribution Workflow

    Branching: Feature branches off main named feature/<short-description>.

    Pull Requests: Use the GitHub “Contribute” workflow—link to .github/CONTRIBUTING.md for details. PRs must include:

        A clear title and description.

        Linked issue (if applicable).

        Passing CI and E2E checks.

    Issue Templates: Bug reports use .github/ISSUE_TEMPLATE/bug_report.md (see Configuring issue templates)
    GitHub Docs
    .

    Reviews: At least one approving review; maintainers merge with squash and descriptive commit messages.

4. Copilot Prompt & Instruction Files

    Global Instructions: This .github/instructions.md is automatically included in all Copilot Chat prompts (via VS Code chat.promptFiles and .github/copilot-instructions.md)
    GitHub Docs
    .

    Reusable Prompts: Individual *.prompt.md files live in .github/prompts/ for task-specific context (e.g. level scaffold, asset loader)
    Visual Studio Code
    .

    Usage: In Chat, type /filename (without .prompt.md) or drag-and-drop the prompt file to include it.

5. Coding Standards & Style

    TypeScript: Strict mode, path aliases @/ → src/, consistent indentation (2 spaces), single-quote strings.

    Go: gofmt/goimports on save, error checks on all I/O, no global variables, use context.Context for request scoping.

    Naming: PascalCase for classes/scenes, camelCase for variables/functions, UPPER_SNAKE_CASE for constants and env vars.

    Markdown: Use GitHub-flavored Markdown, front matter only in issue forms; follow basic syntax rules for headings, lists, code fences
    GitHub Docs
    .

6. Asset & File Conventions

    Directory Layout:

    client/
      src/
        scenes/             # Phaser Scenes (BootScene.ts, MainMenuScene.ts, etc.)
        levels/             # LevelConfig and stub scenes
        assets/{audio,images}
    server/
      main.go               # Static server entrypoint
    .github/
      prompts/              # Reusable prompt files
      ISSUE_TEMPLATE/       # Issue and PR templates
      workflows/            # CI/CD YAML

    Assets: Sprite sheets via TexturePacker, audio in audio/; reference assets in code by key. All assets loaded through AssetLoader.loadAssets(scene).

7. Level & Scene Guidelines

    BootScene: Preload minimal assets, then transition to MainMenuScene.

    MainMenuScene: Display logo, Start/Settings/Quit buttons, handle click events.

    Gameplay Scenes: Each level scene subclasses Phaser.Scene, imports its LevelConfig, and invokes InputManager, AudioManager, and HUDScene.

    HUDScene: Always launched above gameplay scenes; exposes update methods (updateScore, updateHealth).

8. Testing & CI/CD

    CI Workflow (.github/workflows/ci.yml):

        on: push, pull_request

        jobs:

            setup: checkout, install Node.js & Go

            lint: npm run lint (if configured), go vet

            build: npm run build, go build ./server

            test: run Cypress E2E or basic smoke tests.

9. Bug Reporting & Issue Tracking

    Bug Report Template: Use .github/ISSUE_TEMPLATE/bug_report.md with sections for Steps, Expected vs. Actual, Environment, Logs/Screenshots (as per GitHub issue template docs)
    GitHub Docs
    .

    Labeling: Tag bugs with bug, feature requests with enhancement, chore items with chore.

10. Versioning & Releases

    Semantic Versioning: Tag releases vMAJOR.MINOR.PATCH.

    Changelog: Maintain CHANGELOG.md with “Added/Changed/Fixed” sections per release.

    GitHub Releases: Draft a release from each tag, summarizing new features, improvements, and fixes.

Contains AI-generated edits.
