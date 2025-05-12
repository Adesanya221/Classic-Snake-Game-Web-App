# Game Music Files

This folder contains music files for the Snake Game.

## How to Add Music

1. Place your MP3 music files in this directory
2. Place cover art images in the `covers` subdirectory
3. Update the `GAME_TRACKS` array in `src/components/MusicPlayer.tsx` to include your music files

## Default Track Structure

The music player expects tracks in this format:

```javascript
{
  id: '1',                                // Unique identifier
  title: 'Game Theme',                    // Track title
  artist: 'Snake Game',                   // Artist name
  file: '/music/game-theme.mp3',          // Path to MP3 file
  cover: '/music/covers/game-theme.jpg'   // Path to cover image (optional)
}
```

## Recommended Music Types

- Upbeat electronic music
- Chiptune/8-bit style music
- Ambient background music
- Game soundtracks

## File Format Requirements

- Audio files should be in MP3 format for best browser compatibility
- Cover images should be JPG or PNG format, ideally square (e.g., 300x300 pixels)
- Keep file sizes reasonable (under 5MB per track) for faster loading

## Example Files to Add

1. `game-theme.mp3` - Main theme for the game
2. `retro-arcade.mp3` - Retro arcade style music
3. `chill-mode.mp3` - Relaxing background music

With corresponding cover images:
- `covers/game-theme.jpg`
- `covers/retro-arcade.jpg`
- `covers/chill-mode.jpg`
