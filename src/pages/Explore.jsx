import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, PlayCircle } from 'lucide-react';

const dummyArtists = [
  { name: 'Drake', image: '/artist1.jpg' },
  { name: 'Billie Eilish', image: '/artist2.jpg' },
  { name: 'The Weeknd', image: '/artist3.jpg' },
  { name: 'Adele', image: '/artist4.jpg' },
  { name: 'Taylor Swift', image: '/artist5.jpg' },
  { name: 'Kanye West', image: '/artist6.jpg' },
];

const ExplorePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await axios.get('https://vibie-backend.onrender.com/api/explore/explore');
        setSongs(res.data?.trending || []);
      } catch (error) {
        console.error('Error fetching explore data:', error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="mb-6 px-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore Vibes</h1>
        <div className="w-24 h-1 mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full animate-pulse" />
      </div>

      {/* Artist Profiles */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap px-2">
        <div className="flex gap-4">
          {dummyArtists.map((artist, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[70px]">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
              />
              <span className="text-xs mt-1 truncate w-16 text-center">{artist.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
          </motion.div>
        ) : songs.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4 max-w-4xl mx-auto w-full px-2"
          >
            {songs.map((song, index) => (
              <motion.div
                key={`${song.title}-${song.artist}-${index}`}
                className="flex items-center justify-between rounded-xl bg-gray-100 dark:bg-neutral-900 p-3 shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col w-2/3 pr-4">
                  <h2 className="font-semibold text-base truncate">{song.title}</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={song.thumbnail || '/placeholder.jpg'}
                    alt={song.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => console.log('Play', song.title)}
                    className="p-2 rounded-full bg-purple-600 hover:scale-105 transition-transform"
                  >
                    <Play size={18} className="text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
            No songs available right now.
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <PlayCircle size={18} className="text-purple-500" />
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
};

export default ExplorePage;