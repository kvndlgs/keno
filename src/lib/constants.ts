export interface Difficulty {
  name: string;
  multipliers: number[];
  color: string;
}

export const DIFFICULTIES: Record<string, Difficulty> = {
  easy: {
    name: 'Easy',
    multipliers: [0, 3, 4, 8, 10, 15, 30, 40, 100, 200],
    color: 'from-green-600 to-green-700'
  },
  medium: {
    name: 'Medium',
    multipliers: [0, 4, 6, 10, 15, 25, 45, 80, 150, 300],
    color: 'from-yellow-600 to-yellow-700'
  },
  hard: {
    name: 'Hard',
    multipliers: [0, 5, 8, 15, 25, 40, 60, 120, 200, 400],
    color: 'from-red-600 to-red-700'
  }
};