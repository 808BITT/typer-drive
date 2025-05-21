/**
 * Type definitions for Typer Drive
 */

export interface LevelConfig {
  id: string;
  name: string;
  letters: string[];
  boss: boolean;
  // New: Optional custom rules for the level
  customRules?: Record<string, any>;
  // New: Win condition for the level (e.g., score, survive time, defeat boss)
  winCondition?: {
    type: 'score' | 'time' | 'defeat-boss' | 'custom';
    value?: number | string;
    description?: string;
  };
  // New: Boss configuration if this is a boss fight
  bossConfig?: {
    name: string;
    health: number;
    attackPattern: string;
    [key: string]: any;
  };
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
