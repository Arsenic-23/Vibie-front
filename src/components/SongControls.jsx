import React, { useState } from 'react';
import { Heart, PauseCircle, PlayCircle, SkipForward } from 'lucide-react';

export default function SongControls() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex justify-center items-center space-x-8 mt-4">
      {/* Like Button */}
      <button
        onClick={() => setLiked(!liked)}
        className={`transition-colors duration-300 ${
          liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-300'
        }`}
      >
        <Heart fill={liked ? 'currentColor' : 'none'} size={28} />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
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