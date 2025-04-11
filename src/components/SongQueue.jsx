import React from 'react';

export default function SongQueue({ onClose }) {
  const queue = [
    { title: 'Next Vibe', artist: 'DJ Sonic' },
    { title: 'Rhythm Flow', artist: 'Beatline' },
    { title: 'Echo Beats', artist: 'Synthex' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Queue Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-60 animate-slide-up max-h-[90vh] overflow-y-auto">
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
          {queue.map((song, index) => (
            <li key={index} className="text-sm">
              <p className="font-medium">{song.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {song.artist}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}