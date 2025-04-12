import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SongQueue({ onClose }) {
  const [queue, setQueue] = useState([
    {
      id: '1',
      title: 'Next Vibe',
      artist: 'DJ Sonic',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Vibe',
    },
    {
      id: '2',
      title: 'Rhythm Flow',
      artist: 'Beatline',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Flow',
    },
    {
      id: '3',
      title: 'Echo Beats',
      artist: 'Synthex',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Echo',
    },
    {
      id: '4',
      title: 'Midnight Pulse',
      artist: 'NeonWaves',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Pulse',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRemove = (id) => {
    setQueue((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-60 h-[75vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upcoming Songs</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
            title="Close"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-4">
          <AnimatePresence>
            {queue.map((song, index) => (
              <SwipeableSongItem
                key={song.id}
                song={song}
                isCurrent={index === currentIndex}
                onRemove={() => handleRemove(song.id)}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

function SwipeableSongItem({ song, isCurrent, onRemove }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -150 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileTap={{ scale: 0.97 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(event, info) => {
        if (info.offset.x < -100) {
          navigator.vibrate?.(100); // vibrate on swipe left
          onRemove();
        }
      }}
      className={`p-4 rounded-xl shadow-md flex items-center space-x-4 cursor-grab ${
        isCurrent
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
      }`}
    >
      <img
        src={song.thumbnail}
        alt={song.title}
        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
      />
      <div className="flex-1">
        <p className="font-semibold truncate">{song.title}</p>
        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
          {song.artist}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Swipe left to remove</p>
      </div>
    </motion.li>
  );
}