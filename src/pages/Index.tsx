import { useSnakeGame } from "@/hooks/useSnakeGame";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";

const Index = () => {
  const { snake, food, gameOver, score, restartGame, handleControlClick } = useSnakeGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="text-3xl font-bold mb-4 text-purple-800">Welcome, Ignatius!</div>
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold mb-4 text-purple-700">Snake Game</h1>
        <GameBoard snake={snake} food={food} gameOver={gameOver} />
        <GameControls 
          score={score} 
          gameOver={gameOver} 
          onRestart={restartGame}
          onControlClick={handleControlClick}
        />
        <div className="mt-4 text-center text-gray-600">
          <p>Use arrow keys, WASD, or on-screen controls to move</p>
          <p>Space to pause</p>
        </div>
      </div>
    </div>
  );
};

export default Index;