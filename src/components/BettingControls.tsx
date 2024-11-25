import React from 'react';
import { Dices, DivideIcon, ArrowRightLeft } from 'lucide-react';

interface BettingControlsProps {
  bet: number;
  balance: number;
  isPlaying: boolean;
  difficulty: string;
  difficultyColor: string;
  onBetChange: (value: number) => void;
  onAdjustBet: (action: 'half' | 'double' | 'max') => void;
  onPickRandom: () => void;
  onPlay: () => void;
}

export default function BettingControls({
  bet,
  balance,
  isPlaying,
  difficulty,
  difficultyColor,
  onBetChange,
  onAdjustBet,
  onPickRandom,
  onPlay
}: BettingControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">Bet Amount</label>
          <input
            type="number"
            min="1"
            max={balance}
            value={bet}
            onChange={(e) => onBetChange(Math.max(1, Math.min(balance, parseInt(e.target.value) || 0)))}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAdjustBet('half')}
            disabled={isPlaying}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600"
            title="Half Bet"
          >
            <DivideIcon size={20} />
          </button>
          <button
            onClick={() => onAdjustBet('double')}
            disabled={isPlaying}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600"
            title="Double Bet"
          >
            <ArrowRightLeft size={20} />
          </button>
          <button
            onClick={() => onAdjustBet('max')}
            disabled={isPlaying}
            className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 font-semibold"
          >
            Max
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onPickRandom}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 flex-1"
        >
          <Dices size={20} />
          Random Pick
        </button>
        
        <button
          onClick={onPlay}
          disabled={isPlaying}
          className={`px-6 py-2 rounded font-semibold bg-gradient-to-r ${difficultyColor} flex-1`}
        >
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
      </div>
    </div>
  );
}