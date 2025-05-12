import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, Music,
  Headphones, X, Maximize2, Minimize2, ListMusic
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define the structure of a music track
interface Track {
  id: string;
  title: string;
  artist: string;
  file: string;
  cover?: string;
}

// Function to get the base URL
const getBaseUrl = () => {
  return window.location.origin;
};

// Actual tracks from the public/music folder
const GAME_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Therapy Session',
    artist: 'Lil Durk',
    file: '/music/01-Lil-Durk-Therapy-Session-(NaijaBee.com).mp3'
  },
  {
    id: '2',
    title: 'Pelle Coat',
    artist: 'Lil Durk',
    file: '/music/02-Lil-Durk-Pelle-Coat-(NaijaBee.com).mp3'
  },
  {
    id: '3',
    title: 'All My Life',
    artist: 'Lil Durk ft. J Cole',
    file: '/music/03-Lil-Durk-All-My-Life-ft-J-Cole-(NaijaBee.com).mp3'
  },
  {
    id: '4',
    title: 'Never Again',
    artist: 'Lil Durk',
    file: '/music/04-Lil-Durk-Never-Again-(NaijaBee.com).mp3'
  },
  {
    id: '5',
    title: 'Put Em On Ice',
    artist: 'Lil Durk',
    file: '/music/05-Lil-Durk-Put-Em-On-Ice-(NaijaBee.com).mp3'
  },
  {
    id: '6',
    title: 'Big Dawg',
    artist: 'Lil Durk ft. Chief Wuk',
    file: '/music/06-Lil-Durk-Big-Dawg-ft-Chief-Wuk-(NaijaBee.com).mp3'
  },
  {
    id: '7',
    title: 'Never Imagined',
    artist: 'Lil Durk ft. Future',
    file: '/music/07-Lil-Durk-Never-Imagined-ft-Future-(NaijaBee.com).mp3'
  },
  {
    id: '8',
    title: 'Sad Songs',
    artist: 'Lil Durk',
    file: '/music/08-Lil-Durk-Sad-Songs-(NaijaBee.com).mp3'
  }
  // More tracks can be added as needed
];

interface MusicPlayerProps {
  onMusicStart?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onMusicStart }) => {
  // State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tracks] = useState<Track[]>(GAME_TRACKS);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume / 100;
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('play', () => console.log('Audio playback started'));
    audio.addEventListener('pause', () => console.log('Audio playback paused'));
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      alert(`Error playing track: ${e.target.error?.message || 'Unknown error'}`);
    });

    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('play', () => {});
      audio.removeEventListener('pause', () => {});
      audio.removeEventListener('error', () => {});
      audio.pause();
    };
  }, []);

  // Function to start playing all tracks from the beginning
  const startPlaylist = () => {
    if (tracks.length > 0) {
      // Always start with the first track
      console.log('Starting playlist from the first track');
      handlePlayTrack(tracks[0]);
    }
  };

  // Function to handle errors and recover playback
  const handlePlaybackError = () => {
    if (currentTrack && audioRef.current) {
      console.log('Attempting to recover from playback error');
      // Try to play the next track
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex >= 0) {
        const nextIndex = (currentIndex + 1) % tracks.length;
        console.log(`Recovering by playing next track: ${tracks[nextIndex].title}`);
        handlePlayTrack(tracks[nextIndex]);
      } else {
        // If we can't find the current track, restart from the beginning
        console.log('Could not determine current track, restarting playlist');
        handlePlayTrack(tracks[0]);
      }
    }
  };

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle track end
  const handleTrackEnd = () => {
    console.log('Track ended, moving to next track...');
    // Add a small delay to ensure clean transition
    setTimeout(() => {
      // Play the next track in sequential order
      playNextTrack();
    }, 300);
  };

  // Play a track
  const handlePlayTrack = (track: Track) => {
    if (audioRef.current) {
      // If we're already playing this track, just toggle play/pause
      if (currentTrack && currentTrack.id === track.id) {
        togglePlayPause();
        return;
      }

      const fullPath = `${getBaseUrl()}${track.file}`;
      console.log(`Attempting to play track ${track.id}: ${track.title}`);
      console.log('Track path:', fullPath);

      // Pause current playback before loading new track
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
      }

      // Check if the file exists
      fetch(fullPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`File not found: ${fullPath} (${response.status})`);
          }
          return response;
        })
        .then(() => {
          // File exists, try to play it
          audioRef.current!.src = fullPath;
          audioRef.current!.load();

          // Set the current track before playing to ensure proper state
          setCurrentTrack(track);

          // Play the track
          const playPromise = audioRef.current!.play();

          // Handle play promise
          return playPromise;
        })
        .then(() => {
          console.log(`Successfully playing track ${track.id}: ${track.title}`);
          setIsPlaying(true);
          if (onMusicStart) onMusicStart();
        })
        .catch(err => {
          console.error(`Error playing track ${track.id}: ${track.title}`, err);

          // Try to recover by playing the next track
          const nextTrackIndex = (parseInt(track.id) % tracks.length) + 1;
          const nextTrack = tracks.find(t => t.id === nextTrackIndex.toString());

          if (nextTrack) {
            console.log(`Attempting to play next track ${nextTrack.id} instead`);
            setTimeout(() => handlePlayTrack(nextTrack), 500);
          } else {
            alert(`Could not play track: ${track.title}\nError: ${err.message}`);
          }
        });
    } else {
      console.error('Audio element not initialized');
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => {
          console.error('Error playing track:', err);
        });
    }
    setIsPlaying(!isPlaying);
  };

  // Skip to next track - plays in sequential order
  const playNextTrack = () => {
    if (!currentTrack) {
      if (tracks.length > 0) {
        // Start with the first track
        console.log('No current track, starting playlist from beginning');
        handlePlayTrack(tracks[0]);
      }
      return;
    }

    try {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      // Move to next track, or loop back to first track if at the end
      const nextIndex = (currentIndex + 1) % tracks.length;

      // Log the transition for debugging
      console.log(`Track transition: ${currentTrack.title} → ${tracks[nextIndex].title}`);
      console.log(`Playing next track in sequence: ${tracks[nextIndex].title} (Track ${parseInt(tracks[nextIndex].id)})`);

      // Play the next track
      handlePlayTrack(tracks[nextIndex]);
    } catch (err) {
      console.error('Error playing next track:', err);
      // Fallback to first track if there's an error
      if (tracks.length > 0) {
        console.log('Error occurred, restarting playlist from beginning');
        handlePlayTrack(tracks[0]);
      }
    }
  };

  // Skip to previous track - maintains sequential order
  const playPreviousTrack = () => {
    if (!currentTrack) {
      if (tracks.length > 0) {
        // Start with the first track
        handlePlayTrack(tracks[0]);
      }
      return;
    }

    try {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      // Move to previous track, or loop to last track if at the beginning
      const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      console.log(`Playing previous track in sequence: ${tracks[prevIndex].title}`);
      handlePlayTrack(tracks[prevIndex]);
    } catch (err) {
      console.error('Error playing previous track:', err);
    }
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Seek to a specific time
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Render the compact player
  const renderCompactPlayer = () => (
    <div className="flex items-center justify-between bg-black/80 text-white p-2 rounded-lg shadow-lg">
      <div className="flex items-center">
        {isPlaying ? (
          <div className="flex items-center space-x-0.5 mr-2">
            <div className="w-1 h-3 bg-purple-500 animate-pulse-fast rounded-sm"></div>
            <div className="w-1 h-4 bg-purple-500 animate-pulse-slow rounded-sm"></div>
            <div className="w-1 h-2 bg-purple-500 animate-pulse-medium rounded-sm"></div>
          </div>
        ) : (
          <Music className="h-5 w-5 text-purple-500 mr-2" />
        )}
        {currentTrack ? (
          <div className="text-sm truncate max-w-[150px]">
            <span className="font-medium">{currentTrack.title}</span>
            <span className="text-gray-400 text-xs"> - {currentTrack.artist.split(' ')[0]}</span>
          </div>
        ) : (
          <div className="text-sm">Game Music</div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-purple-500"
          onClick={currentTrack ? togglePlayPause : () => setIsExpanded(true)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:text-purple-500"
          onClick={() => setIsExpanded(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Render the expanded player
  const renderExpandedPlayer = () => (
    <div className="bg-gradient-to-b from-zinc-900 to-black text-white p-4 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-purple-500" />
          <h3 className="font-bold">Game Music</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-purple-500"
            onClick={() => setIsExpanded(false)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current track */}
      {currentTrack && (
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md shadow-md mb-2 flex items-center justify-center">
            {currentTrack.cover ? (
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <Music className="h-10 w-10 mb-1" />
                <div className="text-xs font-medium">{currentTrack.artist.split(' ')[0]}</div>
              </div>
            )}
          </div>
          <div className="text-center">
            <h4 className="font-semibold truncate max-w-[250px]">{currentTrack.title}</h4>
            <p className="text-sm text-gray-400 truncate max-w-[250px]">
              {currentTrack.artist}
            </p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {currentTrack && (
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Playback controls */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:text-purple-500"
          onClick={playPreviousTrack}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 text-white bg-purple-500/20 hover:bg-purple-500/30 rounded-full"
          onClick={togglePlayPause}
          disabled={!currentTrack}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-white hover:text-purple-500"
          onClick={playNextTrack}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-2 mb-6">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0])}
          className="w-full"
        />
      </div>

      {/* Track list */}
      <div className="space-y-2">
        <h4 className="font-medium flex items-center gap-2">
          <ListMusic className="h-4 w-4 text-purple-500" />
          Game Tracks ({tracks.length}) - Plays in Order
        </h4>
        <ScrollArea className="h-[200px]">
          <div className="space-y-1">
            {tracks.map((track) => (
              <button
                key={track.id}
                className={`w-full text-left p-2 rounded-md transition-colors flex items-center gap-2 ${
                  currentTrack?.id === track.id
                    ? 'bg-purple-500/20 text-white'
                    : 'hover:bg-white/10 text-gray-300'
                }`}
                onClick={() => handlePlayTrack(track)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex-shrink-0 flex items-center justify-center">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <div className="flex items-center space-x-0.5">
                      <div className="w-1 h-3 bg-white animate-pulse-fast rounded-sm"></div>
                      <div className="w-1 h-4 bg-white animate-pulse-slow rounded-sm"></div>
                      <div className="w-1 h-2 bg-white animate-pulse-medium rounded-sm"></div>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-white">{track.id}</div>
                  )}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-xs text-gray-400 truncate">{track.artist}</div>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0 flex flex-col items-end">
                  <span>{track.file.includes('.mp3') ? 'MP3' : 'Audio'}</span>
                  <span className="text-purple-400">{`Track ${parseInt(track.id)}`}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        renderExpandedPlayer()
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {currentTrack ? renderCompactPlayer() : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-black/80 hover:bg-black text-white"
                      >
                        <Headphones className="h-5 w-5 text-purple-500 mr-2" />
                        Play Lil Durk Tracks
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-transparent border-none shadow-none" onOpenAutoFocus={(e) => {
                      // Prevent auto focus and start playlist when dialog opens
                      e.preventDefault();
                      startPlaylist();
                    }}>
                      {renderExpandedPlayer()}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Game Music Player</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default MusicPlayer;
