import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_FOOD = [5, 5];
const INITIAL_DIRECTION = [0, 1]; // Moving right
const GAME_SPEED = 150;

export const useSnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
      ];
    } while (
      snake.some(
        ([snakeRow, snakeCol]) =>
          snakeRow === newFood[0] && snakeCol === newFood[1]
      )
    );
    return newFood;
  }, [snake]);

  const checkCollision = useCallback(
    (head: number[]) => {
      // Wall collision
      if (
        head[0] < 0 ||
        head[0] >= GRID_SIZE ||
        head[1] < 0 ||
        head[1] >= GRID_SIZE
      ) {
        return true;
      }

      // Self collision (check all except the last piece since it will move)
      for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i][0] === head[0] && snake[i][1] === head[1]) {
          return true;
        }
      }

      return false;
    },
    [snake]
  );

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];

    if (checkCollision(head)) {
      setGameOver(true);
      toast({
        title: "Game Over!",
        description: `Final score: ${score}`,
        variant: "destructive",
      });
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(generateFood());
      setScore((prev) => prev + 10);
      toast({
        title: "Nice!",
        description: "+10 points",
        variant: "default",
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, checkCollision, generateFood, score, toast]);

  const handleDirectionChange = useCallback((newDirection: [number, number]) => {
    if (
      (direction[0] === 0 && newDirection[0] === 0) ||
      (direction[1] === 0 && newDirection[1] === 0)
    ) {
      setDirection(newDirection);
    }
  }, [direction]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key.toLowerCase();
      
      if (key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      const keyDirections: { [key: string]: [number, number] } = {
        arrowup: [-1, 0],
        w: [-1, 0],
        arrowdown: [1, 0],
        s: [1, 0],
        arrowleft: [0, -1],
        a: [0, -1],
        arrowright: [0, 1],
        d: [0, 1],
      };

      if (keyDirections[key]) {
        handleDirectionChange(keyDirections[key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, GAME_SPEED);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [direction, gameOver, moveSnake, handleDirectionChange]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const handleControlClick = (newDirection: [number, number]) => {
    if (!gameOver) {
      handleDirectionChange(newDirection);
    }
  };

  return {
    snake,
    food,
    gameOver,
    score,
    restartGame,
    handleControlClick,
  };
};