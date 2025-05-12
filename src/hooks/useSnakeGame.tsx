import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ScoreEntry } from '@/components/Scoreboard';

interface PlayerInfo {
  playerName: string;
  playerAge: number;
  playerImage?: string;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_FOOD = [5, 5];
const INITIAL_DIRECTION = [0, 1]; // Moving right
const GAME_SPEED = 150;

// Direction constants
const UP: [number, number] = [-1, 0];
const DOWN: [number, number] = [1, 0];
const LEFT: [number, number] = [0, -1];
const RIGHT: [number, number] = [0, 1];

// Load high scores from localStorage or use empty array if none exist
const loadHighScores = (): ScoreEntry[] => {
  const savedScores = localStorage.getItem('snakeGameHighScores');
  return savedScores ? JSON.parse(savedScores) : [];
};

// Save high scores to localStorage
const saveHighScore = (scores: ScoreEntry[]) => {
  localStorage.setItem('snakeGameHighScores', JSON.stringify(scores));
};

// Save score to Firebase
const saveScoreToFirebase = async (scoreData: Omit<ScoreEntry, "id">) => {
  try {
    // Import dynamically to avoid SSR issues
    const { addScore } = await import('@/firebase/firestore');
    return await addScore(scoreData);
  } catch (error) {
    console.error("Error saving score to Firebase:", error);
    return null;
  }
};

export const useSnakeGame = () => {
  // Game state
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<string>("right");

  // Player state
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAge, setPlayerAge] = useState<number>(10);
  const [playerImage, setPlayerImage] = useState<string | undefined>(undefined);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<ScoreEntry[]>(loadHighScores);

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
      // No wall collision - we'll handle wrapping instead

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
    let newRow = newSnake[0][0] + direction[0];
    let newCol = newSnake[0][1] + direction[1];

    // Handle wrapping around edges
    if (newRow < 0) newRow = GRID_SIZE - 1;
    if (newRow >= GRID_SIZE) newRow = 0;
    if (newCol < 0) newCol = GRID_SIZE - 1;
    if (newCol >= GRID_SIZE) newCol = 0;

    const head = [newRow, newCol];

    if (checkCollision(head)) {
      setGameOver(true);

      // Add score to high scores if player has a name
      if (playerName) {
        const newScore: ScoreEntry = {
          playerName,
          playerAge,
          playerImage,
          score,
          date: new Date().toISOString(),
        };

        const updatedScores = [...highScores, newScore];
        // Sort and keep only top 10 scores
        updatedScores.sort((a, b) => b.score - a.score);
        const topScores = updatedScores.slice(0, 10);

        setHighScores(topScores);
        saveHighScore(topScores);

        // Save to Firebase
        saveScoreToFirebase(newScore)
          .then(savedScore => {
            if (savedScore) {
              console.log('Score saved to Firebase:', savedScore);
            }
          })
          .catch(error => {
            console.error('Failed to save score to Firebase:', error);
          });
      }

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
    // Prevent reversing directly into yourself
    const isOppositeDirection = (
      (direction[0] === 1 && newDirection[0] === -1) || // UP vs DOWN
      (direction[0] === -1 && newDirection[0] === 1) || // DOWN vs UP
      (direction[1] === 1 && newDirection[1] === -1) || // LEFT vs RIGHT
      (direction[1] === -1 && newDirection[1] === 1)    // RIGHT vs LEFT
    );

    if (!isOppositeDirection) {
      setDirection(newDirection);

      // Update current direction name for UI
      if (newDirection[0] === -1) setCurrentDirection("up");
      else if (newDirection[0] === 1) setCurrentDirection("down");
      else if (newDirection[1] === -1) setCurrentDirection("left");
      else if (newDirection[1] === 1) setCurrentDirection("right");
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
        arrowup: UP,
        w: UP,
        arrowdown: DOWN,
        s: DOWN,
        arrowleft: LEFT,
        a: LEFT,
        arrowright: RIGHT,
        d: RIGHT,
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
    setCurrentDirection("right");
  };

  const startGame = (name: string, age: number, image?: string) => {
    setPlayerName(name);
    setPlayerAge(age);
    setPlayerImage(image);
    setHasStarted(true);
    restartGame();
  };

  const handleControlClick = (newDirection: [number, number]) => {
    if (gameOver) return;

    // Simply change direction when control is clicked
    handleDirectionChange(newDirection);
  };

  // Add a toggle pause function
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return {
    snake,
    food,
    gameOver,
    score,
    currentDirection,
    playerName,
    playerAge,
    playerImage,
    hasStarted,
    highScores,
    isPaused,
    restartGame,
    startGame,
    handleControlClick,
    togglePause,
  };
};