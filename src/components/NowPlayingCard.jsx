import React from 'react';
import { useAudio } from '../context/AudioProvider';

export default function NowPlayingCard() {
  const { currentTrack } = useAudio();

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-gray-400">No song playing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <img
        src={currentTrack.thumbnail || 'https://placehold.co/256'}
        alt={currentTrack.title}
        className="w-64 h-64 rounded-xl shadow-xl object-cover"
      />
      <h2 className="text-2xl font-bold mt-4 text-center">{currentTrack.title}</h2>
      <p className="text-gray-400 mt-1 text-center">{currentTrack.artist}</p>
    </div>
  );
}
