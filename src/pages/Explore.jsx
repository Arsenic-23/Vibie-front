import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, PlayCircle } from 'lucide-react';

const ExplorePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await axios.get('https://vibie-backend.onrender.com/api/explore/explore');
        if (res.data?.trending) {
          setSongs(res.data.trending);
        } else {
          setSongs([]);
        }
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
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col justify-between font-sans">
      <div>
        {/* Header aligned to the left with a clean classy font */}
        <div className="text-left mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-800 dark:text-white leading-snug">
            Explore Vibes
          </h1>
        </div>

        {/* Loading Animation */}
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
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-6xl mx-auto px-2 mt-6"
            >
              {songs.map((song) => (
                <motion.div
                  key={`${song.title}-${song.artist}`}
                  className="group relative rounded-xl bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-500 p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-white transition-all duration-300">
                    <img
                      src={song.thumbnail || '/placeholder.jpg'}
                      alt={song.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={() => console.log('Play', song.title)}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-purple-600 hover:scale-105 transition-transform"
                    >
                      <Play size={18} className="text-white" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm">
                    <h2 className="font-semibold text-white truncate">{song.title}</h2>
                    <p className="text-xs text-gray-200 truncate">{song.artist}</p>
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
      </div>

      {/* Bottom branding */}
      <div className="mt-12 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <PlayCircle size={18} className="text-purple-500" />
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
};

export default ExplorePage;