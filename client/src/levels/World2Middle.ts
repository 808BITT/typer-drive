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
            letters: ['d', 'k'],
            boss: false
        },
        {
            id: 'middle-1-2',
            name: 'Add E & I (Top Row)',
            letters: ['d', 'k', 'e', 'i'],
            boss: false
        },
        {
            id: 'middle-1-3',
            name: 'Add C & , (Bottom Row)',
            letters: ['d', 'k', 'e', 'i', 'c', ','],
            boss: false
        },
        {
            id: 'middle-1-4',
            name: 'Mix with Index Letters',
            letters: ['d', 'k', 'e', 'i', 'c', ',', 'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'],
            boss: false
        },
        {
            id: 'middle-1-boss',
            name: 'Boss: Index & Middle Challenge',
            letters: ['d', 'k', 'e', 'i', 'c', ',', 'f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'],
            boss: true
        }
    ]
};
// Contains AI-generated edits.
