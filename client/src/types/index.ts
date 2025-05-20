/**
 * Type definitions for Typer Drive
 */

export interface LevelConfig {
  id: string;
  name: string;
  letters: string[];
  boss: boolean;
}

/**
 * Gets user progression from localStorage
 */
export function getProgression(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem('typer-drive-progression');
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Failed to parse progression data', e);
    return {};
  }
}

/**
 * Saves user progression to localStorage
 */
export function setProgression(progression: Record<string, boolean>): void {
  try {
    localStorage.setItem('typer-drive-progression', JSON.stringify(progression));
  } catch (e) {
    console.error('Failed to save progression data', e);
  }
}

// Contains AI-generated edits.
