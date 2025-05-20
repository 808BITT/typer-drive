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