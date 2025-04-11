import React from 'react';

export default function NowPlayingCard({ song }) {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <img src={song.thumbnail} alt={song.title} className="w-64 h-64 rounded-xl shadow-xl" />
      <h2 className="text-2xl font-bold mt-4">{song.title}</h2>
      <p className="text-gray-400">{song.artist}</p>
    </div>
  );
}