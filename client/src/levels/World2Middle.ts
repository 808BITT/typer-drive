import { LevelConfig } from '@/types';

export interface WorldConfig {
    id: string;
    name: string;
    levels: LevelConfig[];
}

// World 2: Middle Fingers (sub-levels and boss)
export const World2Middle: WorldConfig = {
    id: 'world-2-middle',
    name: 'World 2: Middle Fingers',
    levels: [
        {
            id: 'middle-1-1',
            name: 'D & K (Home Row)',
            letters: ['D', 'K'],
            boss: false
        },
        {
            id: 'middle-1-2',
            name: 'Add E & I (Top Row)',
            letters: ['D', 'K', 'E', 'I'],
            boss: false
        },
        {
            id: 'middle-1-3',
            name: 'Add C & , (Bottom Row)',
            letters: ['D', 'K', 'E', 'I', 'C', ','],
            boss: false
        },
        {
            id: 'middle-1-4',
            name: 'Mix with Index Letters',
            letters: ['D', 'K', 'E', 'I', 'C', ',', 'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M'],
            boss: false
        },
        {
            id: 'middle-1-boss',
            name: 'Boss: Index & Middle Challenge',
            letters: ['D', 'K', 'E', 'I', 'C', ',', 'F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M'],
            boss: true
        }
    ]
};
