import React, { useState } from 'react';
import { Heart, PauseCircle, PlayCircle, SkipForward } from 'lucide-react';

export default function SongControls({
  size = 'medium',
  queue,
  currentIndex,
  setCurrentIndex,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setPop(true);
    navigator.vibrate?.([50, 30, 50]);
    setTimeout(() => setPop(false), 300);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    navigator.vibrate?.(20);
  };

  const handleSkipForward = () => {
    if (queue.length > 0) {
      const nextIndex = (currentIndex + 1) % queue.length;
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
      navigator.vibrate?.([60, 20]);
    }
  };

  const iconSize = size === 'large' ? 36 : 28;
  const playPauseSize = size === 'large' ? 54 : 40;

  return (
    <div className="flex justify-center items-center space-x-8 mt-4">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`transition-all duration-300 ${
          liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-300'
        } ${pop ? 'animate-pop' : ''}`}
      >
        <Heart fill={liked ? 'currentColor' : 'none'} size={iconSize} />
      </button>

      {/* Play / Pause Button */}
      <button
        onClick={handlePlayPause}
        className="text-black dark:text-white"
      >
        {isPlaying ? (
          <PauseCircle size={playPauseSize} />
        ) : (
          <PlayCircle size={playPauseSize} />
        )}
      </button>

      {/* Skip Forward */}
      <button
        onClick={handleSkipForward}
        className="text-gray-500 dark:text-gray-300"
      >
        <SkipForward size={iconSize} />
      </button>
    </div>
  );
}