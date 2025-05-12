import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface ScoreEntry {
  id?: string;
  playerName: string;
  playerAge: number;
  playerImage?: string;
  score: number;
  date: string;
}

interface ScoreboardProps {
  scores: ScoreEntry[];
  currentPlayerName?: string;
}

const Scoreboard = ({ scores: propScores, currentPlayerName }: ScoreboardProps) => {
  const [scores, setScores] = useState<ScoreEntry[]>(propScores);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use Firebase scores when available
  useEffect(() => {
    // If prop scores are provided, use them initially
    if (propScores.length > 0) {
      setScores(propScores);
    }

    // Try to fetch scores from Firebase
    const fetchScores = async () => {
      try {
        setLoading(true);
        // Import dynamically to avoid SSR issues
        const { getTopScores } = await import('@/firebase/firestore');
        const firebaseScores = await getTopScores(10);

        if (firebaseScores.length > 0) {
          setScores(firebaseScores);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching scores from Firebase:', err);
        setError('Failed to load scores from the server');
        setLoading(false);
      }
    };

    fetchScores();
  }, [propScores]);

  // Sort scores in descending order
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden p-4 border border-purple-100">
      <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        High Scores
      </h2>

      {loading && <div className="text-center py-4 text-gray-500">Loading scores...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      <Table>
        <TableCaption>Top players and their scores</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedScores.slice(0, 5).map((entry, index) => (
            <TableRow
              key={`${entry.playerName}-${index}`}
              className={currentPlayerName === entry.playerName ? "bg-purple-50" : ""}
            >
              <TableCell className="font-medium">
                {index === 0 ? (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                ) : index === 1 ? (
                  <Medal className="h-5 w-5 text-gray-400" />
                ) : index === 2 ? (
                  <Award className="h-5 w-5 text-amber-600" />
                ) : (
                  index + 1
                )}
              </TableCell>
              <TableCell className={currentPlayerName === entry.playerName ? "font-bold text-purple-700" : ""}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.playerImage} alt={entry.playerName} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xs flex items-center justify-center">
                      {entry.playerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{entry.playerName}</span>
                </div>
              </TableCell>
              <TableCell>{entry.playerAge}</TableCell>
              <TableCell className="text-right font-bold">{entry.score}</TableCell>
            </TableRow>
          ))}
          {sortedScores.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                No scores yet. Be the first to play!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Scoreboard;
