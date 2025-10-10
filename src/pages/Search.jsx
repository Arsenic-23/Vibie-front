import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SearchIcon, Mic } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Suggestions from '../components/Suggestions';

export default function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showWave, setShowWave] = useState(false);

  const recognitionRef = useRef(null);
  const observer = useRef();
  const siriWaveRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

  // Infinite scroll observer (smooth & glitch-free)
  const lastSongElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 0.3 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch search results
  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/search/`, {
          params: { q: query, page },
        });
        const newResults = res.data.results || [];

        const normalized = newResults.map((r) => ({
          id: r.id ?? r.video_id ?? r.videoId,
          title: r.title ?? r.name ?? 'Unknown title',
          channel: r.channel ?? r.artist ?? '',
          thumbnail: r.thumbnail ?? r.thumb ?? '/placeholder.jpg',
          duration: r.duration,
        }));

        setResults((prev) => (page === 1 ? normalized : [...prev, ...normalized]));
        setHasMore(normalized.length > 0);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, page, backendUrl]);

  // Voice recognition setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setShowWave(true);
    };
    recognition.onerror = recognition.onend = () => {
      setIsListening(false);
      setShowWave(false);
      siriWaveRef.current?.stop();
    };
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
        else setInput(transcript);
      }
      if (finalTranscript) {
        const trimmed = finalTranscript.trim();
        setInput(trimmed);
        handleSubmitSearch(trimmed);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // SiriWave animation
  useEffect(() => {
    if (!showWave) return;
    const tryInit = () => {
      const container = document.querySelector('.siri-voice-visualizer');
      if (window.SiriWave && container && !siriWaveRef.current) {
        siriWaveRef.current = new window.SiriWave({
          container,
          width: 270,
          height: 70,
          speed: 0.13,
          amplitude: 2.5,
          style: 'ios',
          autostart: true,
        });
      } else requestAnimationFrame(tryInit);
    };
    tryInit();
    return () => {
      siriWaveRef.current?.stop();
      siriWaveRef.current = null;
    };
  }, [showWave]);

  // Search submit handlers
  const handleSubmitSearch = (searchValue) => {
    setQuery(searchValue);
    setSearchSubmitted(true);
    setResults([]);
    setPage(1);
    setHasMore(true);
    setShowWave(false);
    siriWaveRef.current?.stop();
  };

  const handleSearch = () => {
    if (input.trim()) handleSubmitSearch(input.trim());
  };

  const handleKeyDown = (e) => e.key === 'Enter' && handleSearch();

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition not supported in this browser');
      return;
    }
    if (isListening) recognitionRef.current.stop();
    else {
      if (navigator.vibrate) navigator.vibrate(80);
      setInput('');
      setSearchSubmitted(false);
      setResults([]);
      setPage(1);
      setQuery('');
      setShowWave(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white dark:bg-neutral-950 dark:text-white transition-all flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">Search Vibes</h1>

        {/* Search bar */}
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

        {/* Suggestions */}
        {input.trim() && !searchSubmitted && <Suggestions query={input} onSelect={handleSubmitSearch} />}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-6xl mx-auto px-2">
            {results.map((song, i) => {
              const isLast = results.length === i + 1;
              return (
                <motion.div
                  ref={isLast ? lastSongElementRef : null}
                  key={song.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="group relative rounded-2xl bg-white/30 dark:bg-neutral-800/40 backdrop-blur-lg border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="relative w-full h-36 overflow-hidden">
                    <img
                      src={song.thumbnail || '/placeholder.jpg'}
                      alt={song.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-3 text-sm">
                    <h2 className="font-semibold truncate text-gray-900 dark:text-white">{song.title}</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{song.channel}</p>
                    {song.duration && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{song.duration}</p>
                    )}
                  </div>
                </motion.div>
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

      {/* SiriWave visualizer */}
      <AnimatePresence>
        {showWave && (
          <motion.div
            key="siriwave"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.5 } }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-14 left-0 w-full flex justify-center z-50"
          >
            <div className="siri-voice-visualizer w-[250px] h-[60px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 -mb-0.5 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
}
