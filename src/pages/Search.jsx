import React, { useState, useEffect } from 'react';
import { SearchIcon, Flame, Play } from 'lucide-react';
import axios from 'axios';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const trending = ['Chill Vibes', 'Lo-fi', 'EDM', 'Bollywood', 'Pop', 'RnB'];

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await axios.get(`https://vibie-backend.onrender.com/api/search/search/`, {
          params: { query }
        });
        setResults(res.data.results?.slice(0, 15) || []);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const handlePlay = (song) => {
    console.log('Playing:', song.title);
    // Connect with player logic here
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white dark:bg-black text-black dark:text-white transition-colors">
      <h1 className="text-2xl font-bold text-center mb-4 tracking-tight">Search Vibes</h1>

      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your vibe..."
          className="w-full p-3 pl-11 rounded-full shadow-md bg-gray-100 dark:bg-[#111111] text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
        />
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
      </div>

      {query ? (
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Showing results for "<span className="font-medium text-primary">{query}</span>"
        </div>
      ) : (
        <>
          <div className="mt-10 mb-2 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Flame size={16} />
            <span className="text-sm font-medium">Trending Vibes</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 px-6">
            {trending.map((tag, index) => (
              <button
                key={index}
                onClick={() => setQuery(tag)}
                className="px-3 py-1.5 rounded-full bg-gray-200 dark:bg-[#1c1c1c] text-xs hover:bg-primary dark:hover:bg-primary hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && <div className="text-center mt-6 text-sm text-gray-400">Loading...</div>}

      {!loading && results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto px-2">
          {results.map((song, i) => (
            <div
              key={i}
              className="group relative rounded-xl bg-gray-100 dark:bg-[#1a1a1a] p-2 shadow hover:shadow-md transition-all duration-300"
            >
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <img
                  src={song.thumbnail || '/placeholder.jpg'}
                  alt={song.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handlePlay(song)}
                  className="absolute bottom-1 right-1 p-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform"
                >
                  <Play size={14} className="text-white" />
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
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center mt-6 text-sm text-gray-500">No results found.</div>
      )}
    </div>
  );
}

function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}