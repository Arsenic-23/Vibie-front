import React, { useState } from 'react';
import { Heart, PauseCircle, PlayCircle, SkipForward } from 'lucide-react';

export default function SongControls() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setPop(true);
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

    // Remove animation class after animation completes
    setTimeout(() => setPop(false), 300);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  return (
    <div className="flex justify-center items-center space-x-8 mt-4">
      {/* Like Button with Pop Animation */}
      <button
        onClick={handleLike}
        className={`transition-all duration-300 ${
          liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-300'
        } ${pop ? 'animate-pop' : ''}`}
      >
        <Heart fill={liked ? 'currentColor' : 'none'} size={28} />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className="text-black dark:text-white"
      >
        {isPlaying ? (
          <PauseCircle size={48} />
        ) : (
          <PlayCircle size={48} />
        )}
      </button>

      {/* Forward Button */}
      <button className="text-gray-500 dark:text-gray-300">
        <SkipForward size={28} />
      </button>
    </div>
  );
}