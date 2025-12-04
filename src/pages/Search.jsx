import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SearchIcon, Mic, Play, Pause } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Suggestions from '../components/Suggestions';

export default function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showWave, setShowWave] = useState(false);

  const [playingId, setPlayingId] = useState(null); // NEW

  const recognitionRef = useRef(null);
  const siriWaveRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

  const handlePlayPause = (song) => {
    if (playingId === song.id) {
      setPlayingId(null);
    } else {
      setPlayingId(song.id);
    }
  };

  const fetchResults = useCallback(async (searchValue) => {
    if (!searchValue) return;

    setLoading(true);
    setSearchSubmitted(true);
    setResults([]);

    try {
      const res = await axios.get(`${backendUrl}/search/`, {
        params: { q: searchValue },
      });

      const newResults = res.data.results || [];

      const normalized = newResults.map((r) => ({
        id: r.id ?? r.video_id ?? r.videoId,
        title: r.title ?? r.name ?? 'Unknown title',
        channel: r.channel ?? r.artist ?? '',
        thumbnail: r.thumbnail ?? r.thumb ?? '/placeholder.jpg',
        duration: r.duration,
      }));

      setResults(normalized);
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const handleSubmitSearch = (value) => {
    setQuery(value);
    fetchResults(value);
    setShowWave(false);
    siriWaveRef.current?.stop();
  };

  const handleSearch = () => {
    if (input.trim()) handleSubmitSearch(input.trim());
  };

  const handleKeyDown = (e) => e.key === 'Enter' && handleSearch();

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
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else setInput(t);
      }

      if (finalText) {
        const trimmed = finalText.trim();
        setInput(trimmed);
        handleSubmitSearch(trimmed);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // SiriWave
  useEffect(() => {
    if (!showWave) return;
    const init = () => {
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
      } else requestAnimationFrame(init);
    };
    init();

    return () => {
      siriWaveRef.current?.stop();
      siriWaveRef.current = null;
    };
  }, [showWave]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return alert('Voice recognition not supported');

    if (isListening) recognitionRef.current.stop();
    else {
      if (navigator.vibrate) navigator.vibrate(60);
      setInput('');
      setSearchSubmitted(false);
      setResults([]);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white dark:bg-neutral-950 dark:text-white flex flex-col justify-between">

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
            className="w-full p-3 pl-11 pr-12 rounded-full shadow-lg bg-gray-100 dark:bg-neutral-900 text-sm"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <motion.button
              onClick={handleMicClick}
              className={`p-2 rounded-full ${
                isListening ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-200 dark:bg-neutral-800 dark:text-gray-300'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Mic size={18} />
            </motion.button>
          </div>
        </div>

        {/* Suggestions */}
        {input.trim() && !searchSubmitted && (
          <Suggestions query={input} onSelect={handleSubmitSearch} />
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {results.map((song) => (
              <motion.div
                key={song.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="group relative rounded-2xl bg-white/30 dark:bg-neutral-800/40 backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-36">
                  <img
                    src={song.thumbnail || '/placeholder.jpg'}
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                    alt={song.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-all"
                  />

                  {/* PLAY BUTTON (Mobile always visible, Desktop only on hover) */}
                  <button
                    onClick={() => handlePlayPause(song)}
                    className="
                      absolute bottom-2 right-2 z-20
                      p-2 rounded-full shadow-lg
                      bg-white/80 dark:bg-neutral-900/80 backdrop-blur
                      transition-all
                      md:opacity-0 md:group-hover:opacity-100
                    "
                  >
                    {playingId === song.id ? (
                      <Pause size={18} className="text-black dark:text-white" />
                    ) : (
                      <Play size={18} className="text-black dark:text-white" />
                    )}
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                </div>

                <div className="p-3 text-sm">
                  <h2 className="font-semibold truncate">{song.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{song.channel}</p>
                  {song.duration && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{song.duration}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && searchSubmitted && results.length === 0 && (
          <div className="text-center mt-10 text-sm text-gray-400">No results found. Try another vibe!</div>
        )}

        {loading && <div className="text-center mt-6 text-sm text-gray-400">Loading...</div>}
      </div>

      {/* SiriWave */}
      <AnimatePresence>
        {showWave && (
          <motion.div
            key="siriwave"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-14 left-0 w-full flex justify-center z-50"
          >
            <div className="siri-voice-visualizer w-[250px] h-[60px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Vibie</span>
      </footer>
    </div>
  );
}
