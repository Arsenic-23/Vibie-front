import React, { useState } from 'react';
import { Clock, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockHistory = [
  {
    id: 1,
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    cover: 'https://i.scdn.co/image/ab67616d00001e025f60e85c3bcae8a4680b2c01',
    playedAt: '2025-05-12T13:45:00Z',
    plays: 3
  },
  {
    id: 2,
    title: 'Peaches',
    artist: 'Justin Bieber',
    cover: 'https://i.scdn.co/image/ab67616d00001e021fd9f745af8b2dfb2db0fefb',
    playedAt: '2025-05-12T12:30:00Z',
    plays: 2
  },
  {
    id: 3,
    title: 'Bad Habits',
    artist: 'Ed Sheeran',
    cover: 'https://i.scdn.co/image/ab67616d00001e02377f9a18b96a23fa3783fbb3',
    playedAt: '2025-05-12T10:10:00Z',
    plays: 1
  }
];

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short'
  });
}

export default function History() {
  const [history] = useState(mockHistory);

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Your Listening History</h3>
      <AnimatePresence>
        {history.map((song) => (
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
              <div className="text-xs flex items-center gap-2 text-gray-400 mt-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(song.playedAt)} · Played {song.plays} time{song.plays > 1 ? 's' : ''}</span>
              </div>
            </div>
            <button className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800">
              <Play className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {history.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No listening history found.</p>
      )}
    </div>
  );
}