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
            letters: ['S', 'L'],
            boss: false
        },
        {
            id: 'ring-1-2',
            name: 'Add W & O (Top Row)',
            letters: ['S', 'L', 'W', 'O'],
            boss: false
        },
        {
            id: 'ring-1-3',
            name: 'Add X & . (Bottom Row)',
            letters: ['S', 'L', 'W', 'O', 'X', '.'],
            boss: false
        },
        {
            id: 'ring-1-4',
            name: 'Mix with Index & Middle Letters',
            letters: [
                'S', 'L', 'W', 'O', 'X', '.', // ring
                'D', 'K', 'E', 'I', 'C', ',', // middle
                'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M' // index
            ],
            boss: false
        },
        {
            id: 'ring-1-5',
            name: 'Alternating Combos (Middle & Ring)',
            letters: [
                'S', 'L', 'W', 'O', 'X', '.',
                'D', 'K', 'E', 'I', 'C', ','
            ],
            boss: false
        },
        {
            id: 'ring-1-boss',
            name: 'Boss: Asteroid Field (Ring Challenge)',
            letters: [
                'S', 'L', 'W', 'O', 'X', '.',
                'D', 'K', 'E', 'I', 'C', ',',
                'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M'
            ],
            boss: true
        }
    ]
};
