import React from 'react';

interface GameBoardProps {
  selectedNumbers: number[];
  drawnNumbers: number[];
  isPlaying: boolean;
  onSelectNumber: (num: number) => void;
}

export default function GameBoard({ selectedNumbers, drawnNumbers, isPlaying, onSelectNumber }: GameBoardProps) {
  return (
    <div className="grid grid-cols-10 gap-2 mb-8">
      {Array.from({ length: 80 }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          onClick={() => onSelectNumber(num)}
          disabled={isPlaying}
          className={`
            aspect-square rounded-lg text-lg font-semibold transition-all
            ${selectedNumbers.includes(num) ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-800 hover:bg-gray-700'}
            ${drawnNumbers.includes(num) ? 'ring-2 ring-yellow-400' : ''}
            disabled:opacity-50
          `}
        >
          {num}
        </button>
      ))}
    </div>
  );
}