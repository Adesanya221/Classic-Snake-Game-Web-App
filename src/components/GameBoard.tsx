import { useRef, forwardRef, ForwardedRef } from 'react';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  snake: number[][];
  food: number[];
  gameOver: boolean;
  isPaused?: boolean;
  onCellClick?: (row: number, col: number) => void;
}

const GameBoard = forwardRef(({ snake, food, gameOver, isPaused = false }: GameBoardProps, ref: ForwardedRef<HTMLDivElement>) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const boardRef = ref || internalRef;

  const GRID_SIZE = 20;
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  const isFoodCell = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    return food[0] === row && food[1] === col;
  };

  const isSnakeCell = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    return snake.some(([snakeRow, snakeCol]) => snakeRow === row && snakeCol === col);
  };

  const isSnakeHead = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const head = snake[0];
    return head[0] === row && head[1] === col;
  };

  return (
    <div
      ref={boardRef}
      className={cn(
        "grid grid-cols-[repeat(20,1fr)] gap-[1px] bg-gray-200/80 p-2 rounded-xl w-[min(80vw,500px)] aspect-square border-2 border-gray-300 shadow-md mx-auto backdrop-blur-sm relative",
        gameOver && "opacity-50",
        isPaused && "opacity-70"
      )}

    >
      {cells.map((_, index) => (
        <div
          key={index}
          className={cn(
            "aspect-square bg-white transition-all duration-100 rounded-sm",
            isSnakeHead(index) && "bg-emerald-600 rounded-sm",
            isSnakeCell(index) && !isSnakeHead(index) && "bg-emerald-500 rounded-sm",
            isFoodCell(index) && "bg-red-500 rounded-sm animate-pulse"
          )}
        />
      ))}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-purple-700">Game Paused</h2>
            <p className="text-gray-600">Press the pause button to resume</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default GameBoard;
