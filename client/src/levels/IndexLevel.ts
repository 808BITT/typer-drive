import { LevelConfig } from '@/types';

export const IndexLevelConfig: LevelConfig = {
    id: 'index-1',
    name: 'Index Finger: Home Row',
    letters: ['f', 'r', 'v', 't', 'g', 'b', 'y', 'h', 'n', 'u', 'j', 'm'],
    boss: false,
    customRules: {
        allowBackspace: true,
        timeLimit: 60 // seconds
    },
    winCondition: {
        type: 'score',
        value: 1000,
        description: 'Score at least 1000 points to win.'
    }
};
// Contains AI-generated edits.