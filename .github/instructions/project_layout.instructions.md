---
applyTo: "**"
---

# Project Layout Documentation
This document outlines the folder structure and organization of the Typer Drive project.
Update this file as the project evolves to reflect any changes in the directory structure or organization.
It serves as a guide for developers to understand where to find specific components and how the project is structured.
It is also used to generate the project layout documentation in the GitHub repository.
It is important to keep this document up-to-date to ensure that all team members can easily navigate the project and understand its organization.

## Root Directory Structure

- `client/` - Frontend application code built with Vite, TypeScript, and Phaser 3
- `server/` - Backend Go HTTP server for serving static assets
- `.github/` - GitHub-specific files for workflows, templates, and documentation
- `.vscode/` - VS Code configuration for consistent development experience
- `dist/` - Built and bundled application output (generated)
- `node_modules/` - Frontend dependencies (generated)

## Client Directory (`client/`)

- `src/` - Source code for the game
  - `assets/` - Game assets organized by type
    - `audio/` - Sound effects and music files
    - `images/` - Sprites, backgrounds, and UI elements
  - `entities/` - Game entity classes (Mob, Player, etc.)
  - `scenes/` - Phaser scene classes
  - `levels/` - Level definitions and configurations
  - `utils/` - Utility functions and helper classes
  - `config/` - Game configuration constants
  - `types/` - TypeScript type definitions
  - `main.ts` - Application entry point

## Server Directory (`server/`)

- `main.go` - Go HTTP server entry point
- `static/` - Static files for development (may be symlinked to dist)

## GitHub Directory (`.github/`)

- `instructions/` - AI assistance and project guideline files
  - `vision.instructions.md` - Overall project vision
  - `ai-comments.instructions.md` - AI-generated code comment guidelines
  - `project_layout.instructions.md` - This file
- `prompts/` - Reusable Copilot prompt files
  - `*.prompt.md` - Task-specific context for Copilot

## VSCode Directory (`.vscode/`)

- `settings.json` - Editor settings for consistent formatting
- `extensions.json` - Recommended extensions
- `launch.json` - Debugging configurations

## Build Output (`dist/`)

- Contains compiled and bundled frontend assets
- Served by the Go backend server

## Future Expansion Directories

- `tests/` - Unit and integration tests
- `docs/` - Documentation beyond README

Contains AI-generated edits.
