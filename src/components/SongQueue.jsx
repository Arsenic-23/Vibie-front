import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function SongQueue({ onClose }) {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const wsRef = useRef(null);

  useEffect(() => {
    const stream_id = localStorage.getItem('stream_id');
    const user_id = localStorage.getItem('user_id');

    if (!stream_id || !user_id) return;

    const ws = new WebSocket(`wss://your-backend-url/ws/stream/${stream_id}?user_id=${user_id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'sync' && Array.isArray(data.queue)) {
        setQueue(data.queue);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleRemove = async (songId) => {
    const stream_id = localStorage.getItem('stream_id');

    try {
      await fetch(`https://your-backend-url/queue/${stream_id}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_id: songId }),
      });
    } catch (err) {
      console.error("❌ Failed to remove song from queue:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-60 overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ maxHeight: '80vh' }}
      >
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

        <ul className="space-y-3">
          <AnimatePresence>
            {queue.length === 0 ? (
              <li className="text-gray-400 text-sm">No songs in queue</li>
            ) : (
              queue.map((song, index) => (
                <SwipeableSongItem
                  key={song.song_id}
                  song={song}
                  isCurrent={index === currentIndex}
                  onRemove={() => handleRemove(song.song_id)}
                />
              ))
            )}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  );
}

function SwipeableSongItem({ song, isCurrent, onRemove }) {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-40, 0], [1.1, 0]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-xl"
    >
      <div className="absolute inset-0 bg-red-600 flex items-center justify-end pr-5 z-0">
        <motion.div style={{ scale }}>
          <Trash2 className="text-white w-4 h-4" />
        </motion.div>
      </div>

      <motion.div
        drag="x"
        style={{ x }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={(e, info) => {
          if (info.offset.x < -60) {
            navigator.vibrate?.(70);
            onRemove();
          }
        }}
        className={`relative z-10 p-3 flex items-center space-x-3 cursor-grab shadow-md ${
          isCurrent
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        } rounded-xl`}
      >
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
        />
        <div className="flex-1">
          <p className="font-medium text-sm truncate">{song.title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{song.artist}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Swipe left to remove</p>
        </div>
      </motion.div>
    </motion.li>
  );
}