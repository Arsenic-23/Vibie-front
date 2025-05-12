import React, { useState } from 'react';
import { Play, HeartOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://i.scdn.co/image/ab67616d00001e02a01d5e725e6562c43ab58a75"
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    cover: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    cover: "https://i.scdn.co/image/ab67616d00001e02e3b99d6c0bc97aa56f2587c4"
  }
  {
    id: 4,
    title: "Apocalypse",
    artist: "Ciggerate after sex",
    cover: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
  }
];

export default function Favourites() {
  const [songs, setSongs] = useState(mockSongs);

  const removeSong = (id) => {
    setSongs((prev) => prev.filter((song) => song.id !== id));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Your Favourite Songs</h3>
      <AnimatePresence>
        {songs.map((song) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 flex items-center gap-4 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <img
              src={song.cover}
              alt={`${song.title} cover`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{song.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-800">
                <Play className="w-5 h-5 text-pink-600 dark:text-pink-300" />
              </button>
              <button
                onClick={() => removeSong(song.id)}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
              >
                <HeartOff className="w-5 h-5 text-red-600 dark:text-red-300" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {songs.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No favourite songs left.</p>
      )}
    </div>
  );
}