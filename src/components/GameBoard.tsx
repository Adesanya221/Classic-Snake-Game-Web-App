import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  snake: number[][];
  food: number[];
  gameOver: boolean;
}

const GameBoard = ({ snake, food, gameOver }: GameBoardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Snake position updated:', snake);
    console.log('Food position:', food);
  }, [snake, food]);

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
        "grid grid-cols-[repeat(20,1fr)] gap-[1px] bg-gray-200 p-1 rounded-lg w-[min(90vw,600px)] aspect-square",
        gameOver && "opacity-50"
      )}
    >
      {cells.map((_, index) => (
        <div
          key={index}
          className={cn(
            "aspect-square bg-white transition-all duration-100",
            isSnakeHead(index) && "bg-emerald-600 rounded-sm",
            isSnakeCell(index) && !isSnakeHead(index) && "bg-emerald-500 rounded-sm",
            isFoodCell(index) && "bg-red-500 rounded-sm animate-pulse"
          )}
        />
      ))}
    </div>
  );
};

export default GameBoard;