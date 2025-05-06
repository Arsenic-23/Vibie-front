import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from "../context/ThemeContext";
import { Play } from 'lucide-react';

// Mock data for demonstration
const mockGenres = ['Pop', 'Hip-hop', 'Jazz', 'Classical', 'Rock'];
const mockSongs = [
  { title: 'Song 1', artist: 'Artist 1', thumbnail: '/path/to/thumbnail1.jpg' },
  { title: 'Song 2', artist: 'Artist 2', thumbnail: '/path/to/thumbnail2.jpg' },
  { title: 'Song 3', artist: 'Artist 3', thumbnail: '/path/to/thumbnail3.jpg' },
  { title: 'Song 4', artist: 'Artist 4', thumbnail: '/path/to/thumbnail4.jpg' },
];

const ExplorePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [genres, setGenres] = useState(mockGenres);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreData, setGenreData] = useState(mockSongs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate data fetch
    setTimeout(() => {
      setLoading(false);
      setGenreData(mockSongs); // mock data as placeholder
    }, 1500);
  }, [selectedGenre]);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-black'} transition-all`}>
      {/* Genre Selector */}
      <div className="flex overflow-x-auto gap-4 pb-2 mb-10 scrollbar-hide">
        {genres.map((genre, idx) => (
          <motion.div
            key={idx}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`min-w-[120px] px-6 py-3 rounded-full cursor-pointer text-sm font-semibold transition ${selectedGenre === genre ? 'bg-purple-600 text-white shadow-xl' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </motion.div>
        ))}
      </div>

      {/* Loader or Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center h-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-pulse text-gray-400 text-lg">Loading...</div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <MusicSection title="Top Songs" songs={genreData} />
            <MusicSection title="New Releases" songs={genreData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Song Card Component
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

// Music Section Component
const MusicSection = ({ title, songs }) => (
  <div className="mb-10">
    <motion.h2
      className="text-2xl font-bold mb-4 tracking-wide"
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