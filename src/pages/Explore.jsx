import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

const ExplorePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await axios.get('https://vibie-backend.onrender.com/api/explore/explore');
        if (res.data?.results) {
          setSongs(res.data.results);
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
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">Explore Vibes</h1>

        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center h-96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
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
                  className="group relative rounded-xl bg-gray-100 dark:bg-neutral-900 p-3 shadow hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={song.thumbnail || '/placeholder.jpg'}
                      alt={song.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => console.log('Play', song.title)}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-purple-600 hover:scale-105 transition-transform"
                    >
                      <Play size={18} className="text-white" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm">
                    <h2 className="font-semibold truncate">{song.title}</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
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
    </div>
  );
};

export default ExplorePage;