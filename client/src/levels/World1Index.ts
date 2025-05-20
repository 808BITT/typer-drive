import { LevelConfig } from '@/types';

// World 1: Index Fingers (sub-levels and boss)
export interface WorldConfig {
    id: string;
    name: string;
    levels: LevelConfig[];
}

export const World1Index: WorldConfig = {
    id: 'world-1-index',
    name: 'World 1: Index Fingers',
    levels: [
        {
            id: 'index-1-1',
            name: 'F & J (Home Row)',
            letters: ['f', 'j'],
            boss: false
        },
        {
            id: 'index-1-2',
            name: 'Add G & H',
            letters: ['f', 'j', 'g', 'h'],
            boss: false
        },
        {
            id: 'index-1-3',
            name: 'Add R & U (Top Row)',
            letters: ['f', 'j', 'g', 'h', 'r', 'u'],
            boss: false
        },
        {
            id: 'index-1-4',
            name: 'Add T & Y',
            letters: ['f', 'j', 'g', 'h', 'r', 'u', 't', 'y'],
            boss: false
        },
        {
            id: 'index-1-5',
            name: 'Add V, B, N, M (Bottom Row)',
            letters: ['f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'],
            boss: false
        },
        {
            id: 'index-1-boss',
            name: 'Boss: Index Finger Words',
            letters: ['f', 'j', 'g', 'h', 'r', 'u', 't', 'y', 'v', 'b', 'n', 'm'],
            boss: true
        }
    ]
};
// Contains AI-generated edits.
