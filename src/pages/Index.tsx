import { useSnakeGame } from "@/hooks/useSnakeGame";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";

const Index = () => {
  const { snake, food, gameOver, score, restartGame } = useSnakeGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Snake Game</h1>
      <div className="flex flex-col items-center gap-4">
        <GameBoard snake={snake} food={food} gameOver={gameOver} />
        <GameControls score={score} gameOver={gameOver} onRestart={restartGame} />
      </div>
      <div className="mt-8 text-center text-gray-600">
        <p>Use arrow keys or WASD to move</p>
        <p>Space to pause</p>
      </div>
    </div>
  );
};

export default Index;