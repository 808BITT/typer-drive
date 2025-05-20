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
            letters: ['a', ';'],
            boss: false
        },
        {
            id: 'pinky-1-2',
            name: 'Add Q & P (Top Row)',
            letters: ['a', ';', 'q', 'p'],
            boss: false
        },
        {
            id: 'pinky-1-3',
            name: 'Add Z & / (Bottom Row)',
            letters: ['a', ';', 'q', 'p', 'z', '/'],
            boss: false
        },
        {
            id: 'pinky-1-4',
            name: 'Mix with Other Fingers',
            letters: [
                'a', ';', 'q', 'p', 'z', '/', "'", // pinky
                's', 'l', 'w', 'o', 'x', '.',      // ring
                'd', 'k', 'e', 'i', 'c', ',',      // middle
                'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm' // index
            ],
            boss: false
        },
        {
            id: 'pinky-1-5',
            name: 'Shift & Capitals',
            letters: [
                'a', ';', 'q', 'p', 'z', '/', "'",
                's', 'l', 'w', 'o', 'x', '.',
                'd', 'k', 'e', 'i', 'c', ',',
                'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'
                // Remove uppercase for now
            ],
            boss: false
        },
        {
            id: 'pinky-1-boss',
            name: 'Boss: Final Alien Warlord',
            letters: [
                'a', ';', 'q', 'p', 'z', '/', "'",
                's', 'l', 'w', 'o', 'x', '.',
                'd', 'k', 'e', 'i', 'c', ',',
                'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'
                // Remove uppercase for now
            ],
            boss: true
        }
    ]
};
// Contains AI-generated edits.
