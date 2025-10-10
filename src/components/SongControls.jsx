import React from 'react';
import { SkipBack, SkipForward } from 'lucide-react';
import PlayPauseButton from './PlayPauseButton';
import { useAudio } from '../context/AudioProvider';

export default function SongControls() {
  const { isPlaying, togglePlayPause, playNext, playPrevious } = useAudio();

  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      {/* Previous Song */}
      <button
        onClick={playPrevious}
        className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md"
      >
        <SkipBack size={24} />
      </button>

      {/* Play/Pause */}
      <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayPause} />

      {/* Next Song */}
      <button
        onClick={playNext}
        className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md"
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
}
