import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchIcon, Play, Mic } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const observer = useRef();
  const siriWaveRef = useRef(null);

  const lastSongElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await axios.get('https://vibie-backend.onrender.com/api/search/search/', {
          params: { query, page },
        });
        const newResults = res.data.results || [];
        setResults((prev) => [...prev, ...newResults]);
        setHasMore(newResults.length === 15);
      } catch (error) {
        console.error(error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, page]);

  useEffect(() => {
    // Initialize SiriWave
    if (!siriWaveRef.current && window.SiriWave) {
      const container = document.querySelector('.siri-voice-visualizer');
      if (container) {
        siriWaveRef.current = new SiriWave({
          container,
          width: 250,
          height: 60,
          speed: 0.2,
          amplitude: 3,
          autostart: false,
        });
      }
    }

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        siriWaveRef.current?.start();
      };

      recognition.onerror = () => {
        setIsListening(false);
        siriWaveRef.current?.stop();
      };

      recognition.onend = () => {
        setIsListening(false);
        siriWaveRef.current?.stop();
      };

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.trim();
          setInput(transcript);
          setQuery(transcript);
          setSearchSubmitted(true);
          setResults([]);
          setPage(1);
          setHasMore(true);
          siriWaveRef.current?.stop(); // Ensure wave stops here too
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSearch = () => {
    if (input.trim()) {
      setQuery(input.trim());
      setSearchSubmitted(true);
      setResults([]);
      setPage(1);
      setHasMore(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    // Vibrate if supported (iOS-like haptic)
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    // Start recognition
    setInput('');
    setSearchSubmitted(false);
    recognitionRef.current.start();
  };

  const handlePlay = (song) => {
    console.log('Playing:', song.title);
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">Search Vibes</h1>
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (!e.target.value) setSearchSubmitted(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Find your vibe..."
            className="w-full p-3 pl-11 pr-12 rounded-full shadow-lg bg-gray-100 dark:bg-neutral-900 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
          <SearchIcon
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            size={18}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <motion.button
              onClick={handleMicClick}
              className={`relative p-2 rounded-full ${
                isListening
                  ? 'bg-purple-600 text-white shadow-lg animate-pulse'
                  : 'bg-gray-200 text-gray-600 dark:bg-neutral-800 dark:text-gray-300'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Mic size={18} />
            </motion.button>
          </div>
        </div>

        {/* Siri Wave Visualizer */}
        <div className="siri-voice-visualizer fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50" />

        <AnimatePresence>
          {!searchSubmitted && (
            <motion.div
              key="discover-box"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="mt-10 mx-auto max-w-3xl px-6 py-10 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl bg-gradient-to-br from-white/20 to-purple-100/10 dark:from-neutral-800/30 dark:to-purple-900/10 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-violet-600" />
              <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
                <span className="text-purple-500 font-medium">Discover</span> your favorite tracks, artists, and vibes
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-6xl mx-auto px-2">
            {results.map((song, i) => {
              const isLast = results.length === i + 1;
              return (
                <div
                  ref={isLast ? lastSongElementRef : null}
                  key={i}
                  className="group relative rounded-xl bg-gray-100 dark:bg-neutral-900 p-3 shadow hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <img
                      src={song.thumbnail || '/placeholder.jpg'}
                      alt={song.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                    <button
                      onClick={() => handlePlay(song)}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-purple-600 hover:scale-105 transition-transform"
                    >
                      <Play size={18} className="text-white" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm">
                    <h2 className="font-semibold truncate">{song.title}</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                    {song.duration && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-500">{formatDuration(song.duration)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && searchSubmitted && results.length === 0 && page === 1 && (
          <div className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
            No results found. Try a different vibe!
          </div>
        )}

        {loading && <div className="text-center mt-6 text-sm text-gray-400">Loading...</div>}
      </div>
    </div>
  );
}