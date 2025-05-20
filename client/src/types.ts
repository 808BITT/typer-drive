/**
 * LevelConfig describes a single typing level:
 * - id: unique identifier
 * - name: display name
 * - letters: the keys to practice
 * - boss: whether this is a boss level
 */
export interface LevelConfig {
    id: string;
    name: string;
    letters: string[];
    boss: boolean;
}

// Utility for progression lock/unlock
export function getProgression(): Record<string, boolean> {
    try {
        return JSON.parse(localStorage.getItem('progression') || '{}');
    } catch {
        return {};
    }
}
export function setProgression(prog: Record<string, boolean>) {
    localStorage.setItem('progression', JSON.stringify(prog));
}