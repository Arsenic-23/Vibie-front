import React, { useState } from 'react';

export default function SongQueue({ onClose }) {
  const [queue, setQueue] = useState([
    {
      title: 'Next Vibe',
      artist: 'DJ Sonic',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Vibe',
    },
    {
      title: 'Rhythm Flow',
      artist: 'Beatline',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Flow',
    },
    {
      title: 'Echo Beats',
      artist: 'Synthex',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Echo',
    },
    {
      title: 'Midnight Pulse',
      artist: 'NeonWaves',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Pulse',
    },
    {
      title: 'Synth Escape',
      artist: 'SkyDrive',
      thumbnail: 'https://via.placeholder.com/100x100.png?text=Escape',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlayNext = (index) => {
    if (index === currentIndex) return;
    const updatedQueue = [...queue];
    const [selectedSong] = updatedQueue.splice(index, 1);
    updatedQueue.splice(currentIndex + 1, 0, selectedSong);
    setQueue(updatedQueue);
  };

  const handleRemove = (index) => {
    const updatedQueue = queue.filter((_, i) => i !== index);
    setQueue(updatedQueue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Queue Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl p-6 shadow-2xl z-60 animate-slide-up max-h-[90vh] overflow-y-auto">
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

        <div className="overflow-x-auto">
          <ul className="flex space-x-4 pb-2">
            {queue.map((song, index) => (
              <li
                key={index}
                className={`min-w-[220px] p-4 rounded-xl shadow transition duration-300 flex-shrink-0 ${
                  index === currentIndex
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-4">
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
                    <div className="flex justify-end space-x-2 mt-2 text-xs">
                      {index !== currentIndex && (
                        <button
                          onClick={() => handlePlayNext(index)}
                          className="text-blue-500 hover:underline"
                        >
                          Play Next
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}