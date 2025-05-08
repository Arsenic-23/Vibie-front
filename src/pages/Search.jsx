import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchIcon, Mic, Play, PlayCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search() {
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [listening, setListening] = useState(false);
  const micRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  const observer = useRef();

  const lastSongElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

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
        if (newResults.length < 15) setHasMore(false);
      } catch (error) {
        console.error(error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query, page]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (input.trim()) {
        setResults([]);
        setQuery(input.trim());
        setSearchSubmitted(true);
      }
    }
  };

  const startListening = async () => {
    setListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN,en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setQuery(transcript);
      setSearchSubmitted(true);
    };

    recognition.onend = () => {
      setListening(false);
      stopWaveform();
    };

    recognition.onerror = () => {
      setListening(false);
      stopWaveform();
    };

    recognition.start();
    initWaveform();
  };

  const initWaveform = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 128;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    drawWaveform();
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!listening) return;
      requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / dataArrayRef.current.length;

      dataArrayRef.current.forEach((val, i) => {
        const y = (val / 255) * height;
        ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.fillRect(i * barWidth, height - y, barWidth - 1, y);
      });
    };

    draw();
  };

  const stopWaveform = () => {
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const handlePlay = (song) => {
    console.log('Playing:', song.title);
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
              if (!e.target.value) {
                setSearchSubmitted(false);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Find your vibe..."
            className="w-full p-3 pl-11 pr-14 rounded-full shadow-lg bg-gray-100 dark:bg-neutral-900 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />

          <button
            onClick={startListening}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center"
          >
            <Mic size={16} />
          </button>

          {listening && (
            <canvas
              ref={canvasRef}
              width="220"
              height="30"
              className="absolute -bottom-8 left-1/2 -translate-x-1/2"
            ></canvas>
          )}
        </div>

        {/* Discover box and results here (same as before) */}
        {/* ... */}

        <div className="mt-12 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <PlayCircle size={18} className="text-purple-500" />
          <span className="font-semibold">Vibie</span>
        </div>
      </div>
    </div>
  );
}
