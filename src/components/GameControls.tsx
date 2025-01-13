import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameControlsProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
}

const GameControls = ({ score, gameOver, onRestart }: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="text-2xl font-bold">Score: {score}</div>
      {gameOver && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-bold text-red-500">Game Over!</div>
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
          >
            <RefreshCw className="w-4 h-4" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameControls;