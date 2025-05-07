import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from "../context/ThemeContext";
import { Play } from 'lucide-react';

const ExplorePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://vibie-backend.onrender.com/api/explore/explore');
        const data = await res.json();
        const genreKeys = Object.keys(data);
        setGenres(genreKeys);
        setAllData(data);
        if (genreKeys.length > 0) setSelectedGenre(genreKeys[0]);
      } catch (error) {
        console.error('Error fetching explore data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, []);

  const currentSongs = selectedGenre && allData[selectedGenre] ? allData[selectedGenre] : [];

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-black'} transition-all`}>
      {/* Genre Selector */}
      {genres.length > 0 && (
        <div className="flex overflow-x-auto gap-4 pb-2 mb-10 scrollbar-hide">
          {genres.map((genre, idx) => (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`min-w-[120px] px-6 py-3 rounded-full cursor-pointer text-sm font-semibold transition ${
                selectedGenre === genre ? 'bg-purple-600 text-white shadow-xl' : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </motion.div>
          ))}
        </div>
      )}

      {/* Loader or Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            className="flex justify-center items-center h-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {currentSongs.length > 0 ? (
              <MusicSection title={selectedGenre} songs={currentSongs} />
            ) : (
              <div className="text-center text-gray-400">No songs found.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SongCard = ({ song }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative bg-white/10 backdrop-blur-lg p-4 rounded-2xl transition shadow-md hover:shadow-xl cursor-pointer group"
  >
    <div className="aspect-square w-full overflow-hidden rounded-xl mb-3">
      <img
        src={song.thumbnail}
        alt={song.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => (e.target.src = '/fallback.jpg')}
      />
    </div>
    <div className="text-white font-semibold truncate">{song.title}</div>
    <div className="text-gray-300 text-sm truncate">{song.artist}</div>
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="absolute top-4 right-4 bg-purple-600 p-2 rounded-full shadow-lg hover:scale-105 transition"
    >
      <Play size={18} className="text-white" />
    </motion.button>
  </motion.div>
);

const MusicSection = ({ title, songs }) => (
  <div className="mb-10">
    <motion.h2
      className="text-2xl font-bold mb-4 tracking-wide capitalize"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title}
    </motion.h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {songs.map((song, idx) => (
        <SongCard key={idx} song={song} />
      ))}
    </div>
  </div>
);

export default ExplorePage;