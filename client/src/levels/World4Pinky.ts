import { LevelConfig } from '@/types';

export interface WorldConfig {
    id: string;
    name: string;
    levels: LevelConfig[];
}

// World 4: Pinky Fingers (sub-levels and boss)
export const World4Pinky: WorldConfig = {
    id: 'world-4-pinky',
    name: 'World 4: Pinky Fingers',
    levels: [
        {
            id: 'pinky-1-1',
            name: 'A & ; (Home Row)',
            letters: ['A', ';'],
            boss: false
        },
        {
            id: 'pinky-1-2',
            name: 'Add Q & P (Top Row)',
            letters: ['A', ';', 'Q', 'P'],
            boss: false
        },
        {
            id: 'pinky-1-3',
            name: 'Add Z & / (Bottom Row)',
            letters: ['A', ';', 'Q', 'P', 'Z', '/'],
            boss: false
        },
        {
            id: 'pinky-1-4',
            name: 'Mix with Other Fingers',
            letters: [
                'A', ';', 'Q', 'P', 'Z', '/', "'", // pinky
                'S', 'L', 'W', 'O', 'X', '.',      // ring
                'D', 'K', 'E', 'I', 'C', ',',      // middle
                'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M' // index
            ],
            boss: false
        },
        {
            id: 'pinky-1-5',
            name: 'Shift & Capitals',
            letters: [
                'A', ';', 'Q', 'P', 'Z', '/', "'",
                'S', 'L', 'W', 'O', 'X', '.',
                'D', 'K', 'E', 'I', 'C', ',',
                'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M',
                // Add uppercase for practice
                'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
            ],
            boss: false
        },
        {
            id: 'pinky-1-boss',
            name: 'Boss: Final Alien Warlord',
            letters: [
                'A', ';', 'Q', 'P', 'Z', '/', "'",
                'S', 'L', 'W', 'O', 'X', '.',
                'D', 'K', 'E', 'I', 'C', ',',
                'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M',
                // All uppercase
                'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'
            ],
            boss: true
        }
    ]
};
