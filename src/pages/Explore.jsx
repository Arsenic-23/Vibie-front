import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from "../context/ThemeContext";

// Mock Data
const mockData = {
  genres: ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical', 'Electronic'],
  explore: {
    'Pop': {
      top_songs: [
        { title: 'Song 1', artist: 'Artist 1', thumbnail: '/song1.jpg' },
        { title: 'Song 2', artist: 'Artist 2', thumbnail: '/song2.jpg' }
      ],
      new_releases: [
        { title: 'New Song 1', artist: 'Artist 3', thumbnail: '/song3.jpg' },
        { title: 'New Song 2', artist: 'Artist 4', thumbnail: '/song4.jpg' }
      ]
    },
    // More genres data here...
  }
};

// ThemeToggle Component
const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    navigator.vibrate?.(100); // Trigger vibration on toggle
    setDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-14 h-8 flex items-center px-1 rounded-full transition-all duration-300 ${
        darkMode ? 'bg-yellow-400' : 'bg-gray-700'
      }`}
      title="Toggle theme"
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform ${
          darkMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-black'
        }`}
      >
        {darkMode ? (
          <Moon size={16} className="text-yellow-400" />
        ) : (
          <Sun size={16} className="text-white" />
        )}
      </div>
    </button>
  );
};

// Song Card Component
const SongCard = ({ song }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl transition shadow-md hover:shadow-xl cursor-pointer"
  >
    <img
      src={song.thumbnail}
      alt={song.title}
      className="w-full h-44 object-cover rounded-xl mb-3"
    />
    <div className="text-white font-semibold truncate">{song.title}</div>
    <div className="text-gray-300 text-sm truncate">{song.artist}</div>
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

const ExplorePage = () => {
  const [genres, setGenres] = useState(mockData.genres);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreData, setGenreData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch songs when genre changes
  useEffect(() => {
    const fetchExploreData = async () => {
      if (!selectedGenre) return;
      setLoading(true);
      try {
        const data = mockData.explore[selectedGenre]; // Using mock data
        setGenreData(data);
      } catch (err) {
        console.error("Error loading genre data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">Explore Vibes</h1>
        <p className="text-lg mt-2 text-gray-300">Discover trending songs, fresh releases, and your next favorite vibe</p>
      </motion.div>

      {/* Genre Selector */}
      <div className="flex overflow-x-auto gap-4 pb-2 mb-10 scrollbar-hide">
        {genres.map((genre, idx) => (
          <motion.div
            key={idx}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`min-w-[120px] px-6 py-3 rounded-full cursor-pointer text-sm font-semibold transition 
              ${
                selectedGenre === genre
                  ? 'bg-pink-600 text-white shadow-xl'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
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
            <div className="animate-pulse text-white text-lg">Loading vibe...</div>
          </motion.div>
        ) : selectedGenre && genreData ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <MusicSection title="Top Songs" songs={genreData.top_songs} />
            <MusicSection title="New Releases" songs={genreData.new_releases} />

            {/* Bonus Section: Editor's Picks */}
            <MusicSection
              title="Editor's Picks"
              songs={[...genreData.top_songs.slice(0, 2), ...genreData.new_releases.slice(0, 2)]}
            />
          </motion.div>
        ) : (
          <motion.div
            key="select"
            className="text-center text-gray-400 mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Select a genre to discover music.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default ExplorePage;