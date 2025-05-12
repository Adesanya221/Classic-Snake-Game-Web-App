import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import ShareScore from './ShareScore';

interface GameControlsProps {
  score: number;
  gameOver: boolean;
  isPaused?: boolean;
  playerName?: string;
  gameboardRef?: React.RefObject<HTMLDivElement>;
  onRestart: () => void;
  onControlClick: (direction: [number, number]) => void;
  onPauseToggle?: () => void;
  currentDirection?: string;
}

const GameControls = ({
  score,
  gameOver,
  isPaused = false,
  playerName = "Player",
  gameboardRef,
  onRestart,
  onControlClick,
  onPauseToggle,
  currentDirection = "right"
}: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex items-center justify-between w-full max-w-xs">
        <div className="text-2xl font-bold text-purple-700">Score: {score}</div>
        {onPauseToggle && !gameOver && (
          <Button
            onClick={onPauseToggle}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200 border-purple-300"
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? <Play className="h-5 w-5 text-purple-700" /> : <Pause className="h-5 w-5 text-purple-700" />}
          </Button>
        )}</div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="col-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([-1, 0])}
            className={`w-12 h-12 rounded-full ${currentDirection === "up" ? 'bg-green-400 hover:bg-green-500' : 'bg-purple-100 hover:bg-purple-200'}`}
          >
            <ArrowUp className={`w-6 h-6 ${currentDirection === "up" ? 'text-white' : 'text-purple-700'}`} />
          </Button>
        </div>
        <div className="col-start-1 row-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([0, -1])}
            className={`w-12 h-12 rounded-full ${currentDirection === "left" ? 'bg-green-400 hover:bg-green-500' : 'bg-purple-100 hover:bg-purple-200'}`}
          >
            <ArrowLeft className={`w-6 h-6 ${currentDirection === "left" ? 'text-white' : 'text-purple-700'}`} />
          </Button>
        </div>
        <div className="col-start-3 row-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([0, 1])}
            className={`w-12 h-12 rounded-full ${currentDirection === "right" ? 'bg-green-400 hover:bg-green-500' : 'bg-purple-100 hover:bg-purple-200'}`}
          >
            <ArrowRight className={`w-6 h-6 ${currentDirection === "right" ? 'text-white' : 'text-purple-700'}`} />
          </Button>
        </div>
        <div className="col-start-2 row-start-2">
          <Button
            variant="outline"
            onClick={() => onControlClick([1, 0])}
            className={`w-12 h-12 rounded-full ${currentDirection === "down" ? 'bg-green-400 hover:bg-green-500' : 'bg-purple-100 hover:bg-purple-200'}`}
          >
            <ArrowDown className={`w-6 h-6 ${currentDirection === "down" ? 'text-white' : 'text-purple-700'}`} />
          </Button>
        </div>
      </div>
      {gameOver && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-bold text-red-500">Game Over!</div>

          {/* Share Score Component */}
          <ShareScore
            playerName={playerName}
            score={score}
            gameboardRef={gameboardRef}
          />

          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white mt-2"
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