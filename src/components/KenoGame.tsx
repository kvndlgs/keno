import React, { useState } from 'react';
import { Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import GameBoard from './GameBoard';
import BettingControls from './BettingControls';
import { DIFFICULTIES } from '../lib/constants';

const generateServerSeed = () => CryptoJS.lib.WordArray.random(32).toString();
const generateClientSeed = () => CryptoJS.lib.WordArray.random(32).toString();

export default function KenoGame() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bet, setBet] = useState(1);
  const [balance, setBalance] = useState(1000);
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [serverSeed, setServerSeed] = useState(generateServerSeed());
  const [clientSeed, setClientSeed] = useState(generateClientSeed());
  const [lastHash, setLastHash] = useState('');

  const generateHash = () => {
    return CryptoJS.HmacSHA256(clientSeed, serverSeed).toString();
  };

  const generateDrawnNumbers = (hash: string) => {
    const numbers: number[] = [];
    let index = 0;
    
    while (numbers.length < 20 && index < hash.length - 8) {
      const hex = hash.substr(index, 8);
      const decimal = parseInt(hex, 16);
      const number = (decimal % 80) + 1;
      
      if (!numbers.includes(number)) {
        numbers.push(number);
      }
      index += 8;
    }
    
    return numbers;
  };

  const selectNumber = (num: number) => {
    if (isPlaying) return;
    
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const pickRandom = () => {
    if (isPlaying) return;
    
    const count = Math.floor(Math.random() * 10) + 1;
    const numbers: number[] = [];
    
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    setSelectedNumbers(numbers);
  };

  const adjustBet = (action: 'half' | 'double' | 'max') => {
    if (isPlaying) return;

    switch (action) {
      case 'half':
        setBet(prev => Math.max(1, Math.floor(prev / 2)));
        break;
      case 'double':
        setBet(prev => Math.min(balance, prev * 2));
        break;
      case 'max':
        setBet(balance);
        break;
    }
  };

  const play = async () => {
    if (selectedNumbers.length === 0) {
      toast.error('Select at least one number');
      return;
    }
    
    if (balance < bet) {
      toast.error('Insufficient balance');
      return;
    }

    setIsPlaying(true);
    setBalance(prev => prev - bet);
    
    const hash = generateHash();
    setLastHash(hash);
    const numbers = generateDrawnNumbers(hash);
    
    for (let i = 0; i < numbers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setDrawnNumbers(prev => [...prev, numbers[i]]);
    }
    
    const matches = selectedNumbers.filter(num => numbers.includes(num)).length;
    const multiplier = DIFFICULTIES[difficulty].multipliers[matches];
    const winAmount = bet * multiplier;
    
    setTimeout(() => {
      if (winAmount > 0) {
        setBalance(prev => prev + winAmount);
        toast.success(`You won ${winAmount} credits!`);
      }
      setServerSeed(generateServerSeed());
      setClientSeed(generateClientSeed());
      setIsPlaying(false);
      setDrawnNumbers([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Provably Fair Keno</h1>
            <p className="text-gray-400">Balance: {balance} credits</p>
          </div>
          
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2"
          >
            {Object.entries(DIFFICULTIES).map(([key, diff]) => (
              <option key={key} value={key}>{diff.name}</option>
            ))}
          </select>
        </div>

        <GameBoard
          selectedNumbers={selectedNumbers}
          drawnNumbers={drawnNumbers}
          isPlaying={isPlaying}
          onSelectNumber={selectNumber}
        />

        <div className="flex flex-col gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BettingControls
                bet={bet}
                balance={balance}
                isPlaying={isPlaying}
                difficulty={difficulty}
                difficultyColor={DIFFICULTIES[difficulty].color}
                onBetChange={setBet}
                onAdjustBet={adjustBet}
                onPickRandom={pickRandom}
                onPlay={play}
              />

              <div className="space-y-2">
                <h3 className="font-semibold mb-2">Payouts ({DIFFICULTIES[difficulty].name})</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {DIFFICULTIES[difficulty].multipliers.map((multiplier, index) => (
                    <div key={index} className="flex justify-between bg-gray-700 px-3 py-1 rounded">
                      <span>{index} matches:</span>
                      <span>{multiplier}x</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Hash size={24} />
              Provably Fair Verification
            </h2>
            <div className="space-y-2 text-sm">
              <p>Server Seed: {serverSeed}</p>
              <p>Client Seed: {clientSeed}</p>
              {lastHash && <p>Last Hash: {lastHash}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}