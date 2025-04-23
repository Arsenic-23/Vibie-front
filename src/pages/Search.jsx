import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SearchIcon, Play, PlayCircle } from 'lucide-react';
import axios from 'axios';

export default function Search() {
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
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
          params: { query, page }
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
    if (e.key === 'Enter' || e.key === ' ') {
      if (input.trim()) {
        setResults([]);
        setQuery(input.trim());
      }
    }
  };

  const handlePlay = (song) => {
    console.log('Playing:', song.title);
    // Add player logic
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">Search Vibes</h1>

        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Find your vibe..."
            className="w-full p-3 pl-11 rounded-full shadow-lg bg-gray-100 dark:bg-neutral-900 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
        </div>

        <div className="mt-6 mx-auto max-w-xl px-4 py-4 rounded-xl backdrop-blur-md border border-white/10 shadow-md bg-gradient-to-br from-white/10 to-purple-100/5 dark:from-neutral-800/20 dark:to-purple-900/5 transition-all duration-500">
  <h2 className="text-sm font-medium text-center text-gray-700 dark:text-gray-200">
    {query ? (
      <>
        Showing results for <span className="text-purple-500 font-semibold">"{query}"</span>
      </>
    ) : (
      <>
        <span className="text-purple-500 font-semibold">Discover</span> your favorite tracks, artists, and vibes
      </>
    )}
  </h2>
</div>

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

        {loading && <div className="text-center mt-6 text-sm text-gray-400">Loading...</div>}

        {!loading && query && results.length === 0 && (
          <div className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
            No results found. Try a different vibe!
          </div>
        )}
      </div>

      {/* Branding Footer */}
      <div className="mt-12 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <PlayCircle size={18} className="text-purple-500" />
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
}

function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}