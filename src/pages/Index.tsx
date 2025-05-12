import { useSnakeGame } from "@/hooks/useSnakeGame";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";
import WelcomeScreen from "@/components/WelcomeScreen";
import Scoreboard from "@/components/Scoreboard";
import MusicPlayer from "@/components/MusicPlayer";
import { useState, useRef } from "react";

const Index = () => {
  const {
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
    togglePause
  } = useSnakeGame();

  // State to track if music is playing
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Ref for the game board (used for screenshots)
  const gameBoardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image with blur effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/image/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.1)', // Prevents blur from showing edges
          opacity: 0.7
        }}
      ></div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/60 via-purple-500/60 to-pink-500/60">
      </div>

      {!hasStarted ? (
        // Welcome Screen
        <div className="relative z-10">
          <WelcomeScreen onStart={startGame} />
        </div>
      ) : (
        // Game Screen
        <div className="w-full max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-4">
            {playerImage && (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <img src={playerImage} alt={playerName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="text-3xl font-bold text-white drop-shadow-lg animate-pulse">
              Welcome, {playerName}! <span className="text-xl">Age: {playerAge}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Game Area */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 border border-white/20 transition-all hover:shadow-purple-300/50 flex-1">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Snake Game</h1>

              <GameBoard
                ref={gameBoardRef}
                snake={snake}
                food={food}
                gameOver={gameOver}
                isPaused={isPaused}
              />
              <GameControls
                score={score}
                gameOver={gameOver}
                isPaused={isPaused}
                playerName={playerName}
                gameboardRef={gameBoardRef}
                onRestart={restartGame}
                onControlClick={handleControlClick}
                onPauseToggle={togglePause}
                currentDirection={currentDirection}
              />
              <div className="mt-4 text-center text-gray-600 bg-gray-100/70 p-3 rounded-lg transition-all hover:bg-gray-100">
                <p>Use arrow keys, WASD, or on-screen controls to change direction</p>
                <p>The green box moves continuously in the current direction</p>
                <p>Space or the pause button to pause/resume the game</p>
                {!isMusicPlaying && <p className="text-purple-600 mt-1">Click "Play Lil Durk Tracks" in the bottom right to enjoy music while playing!</p>}
              </div>
            </div>

            {/* Scoreboard */}
            <div className="md:w-80">
              <Scoreboard scores={highScores} currentPlayerName={playerName} />
            </div>
          </div>
        </div>
      )}

      {/* Music Player */}
      <MusicPlayer onMusicStart={() => setIsMusicPlaying(true)} />
    </div>
  );
};

export default Index;
