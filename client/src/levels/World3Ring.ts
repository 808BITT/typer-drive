import { LevelConfig } from '@/types';

export interface WorldConfig {
    id: string;
    name: string;
    levels: LevelConfig[];
}

// World 3: Ring Fingers (sub-levels and boss)
export const World3Ring: WorldConfig = {
    id: 'world-3-ring',
    name: 'World 3: Ring Fingers',
    levels: [
        {
            id: 'ring-1-1',
            name: 'S & L (Home Row)',
            letters: ['s', 'l'],
            boss: false
        },
        {
            id: 'ring-1-2',
            name: 'Add W & O (Top Row)',
            letters: ['s', 'l', 'w', 'o'],
            boss: false
        },
        {
            id: 'ring-1-3',
            name: 'Add X & . (Bottom Row)',
            letters: ['s', 'l', 'w', 'o', 'x', '.'],
            boss: false
        },
        {
            id: 'ring-1-4',
            name: 'Mix with Index & Middle Letters',
            letters: [
                's', 'l', 'w', 'o', 'x', '.', // ring
                'd', 'k', 'e', 'i', 'c', ',', // middle
                'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm' // index
            ],
            boss: false
        },
        {
            id: 'ring-1-5',
            name: 'Alternating Combos (Middle & Ring)',
            letters: [
                's', 'l', 'w', 'o', 'x', '.',
                'd', 'k', 'e', 'i', 'c', ','
            ],
            boss: false
        },
        {
            id: 'ring-1-boss',
            name: 'Boss: Asteroid Field (Ring Challenge)',
            letters: [
                's', 'l', 'w', 'o', 'x', '.',
                'd', 'k', 'e', 'i', 'c', ',',
                'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'
            ],
            boss: true
        }
    ]
};
// Contains AI-generated edits.
