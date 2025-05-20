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
            letters: ['F', 'J'],
            boss: false
        },
        {
            id: 'index-1-2',
            name: 'Add G & H',
            letters: ['F', 'J', 'G', 'H'],
            boss: false
        },
        {
            id: 'index-1-3',
            name: 'Add R & U (Top Row)',
            letters: ['F', 'J', 'G', 'H', 'R', 'U'],
            boss: false
        },
        {
            id: 'index-1-4',
            name: 'Add T & Y',
            letters: ['F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y'],
            boss: false
        },
        {
            id: 'index-1-5',
            name: 'Add V, B, N, M (Bottom Row)',
            letters: ['F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M'],
            boss: false
        },
        {
            id: 'index-1-boss',
            name: 'Boss: Index Finger Words',
            letters: ['F', 'J', 'G', 'H', 'R', 'U', 'T', 'Y', 'V', 'B', 'N', 'M'],
            boss: true
        }
    ]
};
