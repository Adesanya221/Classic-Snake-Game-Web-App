import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GameControlsProps {
  score: number;
  gameOver: boolean;
  onRestart: () => void;
  onControlClick: (direction: [number, number]) => void;
}

const GameControls = ({ score, gameOver, onRestart, onControlClick }: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="text-2xl font-bold text-purple-700">Score: {score}</div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="col-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([-1, 0])}
            className="w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200"
          >
            <ArrowUp className="w-6 h-6 text-purple-700" />
          </Button>
        </div>
        <div className="col-start-1 row-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([0, -1])}
            className="w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200"
          >
            <ArrowLeft className="w-6 h-6 text-purple-700" />
          </Button>
        </div>
        <div className="col-start-3 row-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([0, 1])}
            className="w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200"
          >
            <ArrowRight className="w-6 h-6 text-purple-700" />
          </Button>
        </div>
        <div className="col-start-2 row-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([1, 0])}
            className="w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200"
          >
            <ArrowDown className="w-6 h-6 text-purple-700" />
          </Button>
        </div>
      </div>
      {gameOver && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-bold text-red-500">Game Over!</div>
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
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