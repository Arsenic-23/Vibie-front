import React from 'react';

const hits = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://i.scdn.co/image/ab67616d0000b273bfbefb8d9c73f4e7b44c3c2c",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://i.scdn.co/image/ab67616d0000b273659f38050b0f6b5b3cb4dbbb",
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    cover: "https://i.scdn.co/image/ab67616d0000b273dc1a7603b5f38f5e50020e5c",
  },
  {
    title: "As It Was",
    artist: "Harry Styles",
    cover: "https://i.scdn.co/image/ab67616d0000b27355521b5f27b96c3e3d99d70c",
  },
];

export default function Explore() {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-extrabold text-white mb-4">Top Hits</h1>
      <div className="grid grid-cols-2 gap-4">
        {hits.map((song, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-md p-3 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <img
              src={song.cover}
              alt={song.title}
              className="rounded-lg w-full aspect-square object-cover mb-3"
            />
            <div className="text-white text-sm font-semibold truncate">{song.title}</div>
            <div className="text-gray-400 text-xs truncate">{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}