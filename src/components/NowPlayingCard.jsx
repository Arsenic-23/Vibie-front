import React from 'react';
import { useAudio } from '../context/AudioProvider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export default function NowPlayingCard() {
  const { currentSong, isPlaying, togglePlay, next, prev } = useAudio();

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-gray-400">No song playing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-6 space-y-4">
      <img
        src={currentSong.thumbnail || '/placeholder.jpg'}
        alt={currentSong.title}
        className="w-56 h-56 rounded-xl shadow-xl object-cover"
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />
      <div className="text-center">
        <h2 className="text-2xl font-bold mt-2">{currentSong.title}</h2>
        <p className="text-gray-400 mt-1">{currentSong.artist}</p>
      </div>

      <div className="flex items-center gap-6 mt-3">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-gray-100 dark:bg-neutral-800 hover:scale-105 transition"
          title="Previous"
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-purple-600 text-white shadow-lg hover:scale-95 transition"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={next}
          className="p-3 rounded-full bg-gray-100 dark:bg-neutral-800 hover:scale-105 transition"
          title="Next"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}