import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useAudio } from '../context/AudioProvider';

export default function SongQueue({ onClose }) {
  const { queue: audioQueue, currentSong, removeFromQueue } = useAudio();
  const [queue, setQueue] = useState([]);
  const wsRef = useRef(null);

  // ✅ Backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔄 Keep queue in sync with AudioProvider
  useEffect(() => {
    setQueue(audioQueue || []);
  }, [audioQueue]);

  // 🔌 Setup WebSocket connection for live queue updates
  useEffect(() => {
    const stream_id = localStorage.getItem('stream_id');
    const user_id = localStorage.getItem('user_id');
    if (!stream_id || !user_id || !backendUrl) return;

    const wsBase = backendUrl.replace(/^http/, 'ws');
    const wsUrl = `${wsBase}/ws/stream/${stream_id}?user_id=${user_id}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'sync' && Array.isArray(data.queue)) {
          if (data.queue.length > 0) {
            setQueue((prev) => {
              const changed =
                JSON.stringify(prev.map((s) => s.song_id)) !==
                JSON.stringify(data.queue.map((s) => s.song_id));
              return changed ? data.queue : prev;
            });
          }
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
      }
    };

    ws.onerror = (err) => console.error('❌ WebSocket error:', err);
    ws.onclose = () => console.log('🔌 WebSocket closed');

    return () => ws.close();
  }, [backendUrl]);

  // 🚀 Automatically POST newly added songs to backend
  useEffect(() => {
    const stream_id = localStorage.getItem('stream_id');
    if (!stream_id || !backendUrl) return;

    const unsyncedSongs = queue.filter((song) => !song.synced);

    unsyncedSongs.forEach(async (song) => {
      const payload = {
        stream_id,
        song_id: song.song_id,
        title: song.title,
        artist: song.artist,
        duration: song.duration || 0,
        thumbnail_url: song.thumbnail_url || song.thumbnail || '',
        audio_url: song.audio_url || '',
      };

      try {
        const res = await fetch(`${backendUrl}/queue/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        console.log('✅ Synced song to backend:', song.title);

        // Mark song as synced to prevent re-posting
        setQueue((prev) =>
          prev.map((s) =>
            s.song_id === song.song_id ? { ...s, synced: true } : s
          )
        );
      } catch (err) {
        console.error('❌ Failed to sync song to backend:', err);
      }
    });
  }, [queue, backendUrl]);

  const handleRemove = (songId) => {
    removeFromQueue(songId);
    setQueue((prev) => prev.filter((s) => s.song_id !== songId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

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
              queue.map((song) => (
                <SwipeableSongItem
                  key={song.song_id}
                  song={song}
                  isCurrent={currentSong?.song_id === song.song_id}
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

// 🎧 Swipe-to-remove component
function SwipeableSongItem({ song, isCurrent, onRemove }) {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-60, 0], [1.1, 1]);
  const opacity = useTransform(x, [-60, 0], [1, 0]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-xl"
    >
      <motion.div
        className="absolute inset-0 bg-red-600 flex items-center justify-end pr-5 z-0"
        style={{ opacity }}
      >
        <motion.div style={{ scale }}>
          <Trash2 className="text-white w-4 h-4" />
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        style={{ x }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={(e, info) => {
          if (info.offset.x < -80) {
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
          src={song.thumbnail_url || song.thumbnail || '/placeholder.jpg'}
          alt={song.title}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
        />

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{song.title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
            {song.artist}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Swipe left to remove
          </p>
        </div>
      </motion.div>
    </motion.li>
  );
}