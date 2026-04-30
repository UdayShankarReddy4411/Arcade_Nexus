export type GameId = 'snake' | 'memory' | 'reaction' | 'typing';

export interface GameScore {
  gameId: GameId;
  score: number;
  date: string;
}

export interface GameMetadata {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const GAMES: GameMetadata[] = [
  {
    id: 'snake',
    title: 'SNAKE_AI.exe',
    description: 'CONSUME. GROWTH. SURVIVE.',
    icon: '🐍',
    color: 'from-green-500 to-cyan-500'
  },
  {
    id: 'memory',
    title: 'NEURAL_LINK.mem',
    description: 'RECALL THE PATTERN.',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'reaction',
    title: 'SYNAPSE_PULSE.ms',
    description: 'SPEED IS SURVIVAL.',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'typing',
    title: 'CODE_BREAKER.txt',
    description: 'DATA UPLOAD IN PROGRESS.',
    icon: '⌨️',
    color: 'from-blue-500 to-indigo-500'
  }
];
