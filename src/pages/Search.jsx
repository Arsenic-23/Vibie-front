// src/pages/Search.jsx
import React, { useState, useEffect } from 'react';
import { SearchIcon, Flame } from 'lucide-react';
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
        const res = await axios.get(`https://vibie-backend.onrender.com/api/search/`, {
          params: { query }
        });
        setResults(res.data.results || []);
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

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white dark:bg-black text-black dark:text-white transition-colors">
      <h1 className="text-3xl font-extrabold text-center mb-4 tracking-tight">Search Vibes</h1>

      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your vibe..."
          className="w-full p-4 pl-12 rounded-full shadow-xl bg-gray-100 dark:bg-[#111111] text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
        />
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
      </div>

      {query ? (
        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing results for "<span className="font-medium text-primary">{query}</span>"
        </div>
      ) : (
        <>
          <div className="mt-10 mb-2 flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Flame size={18} />
            <span className="text-sm font-medium">Trending Vibes</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 px-6">
            {trending.map((tag, index) => (
              <button
                key={index}
                onClick={() => setQuery(tag)}
                className="px-4 py-2 rounded-full bg-gray-200 dark:bg-[#1c1c1c] text-sm hover:bg-primary dark:hover:bg-primary hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && <div className="text-center mt-6 text-sm text-gray-400">Loading...</div>}

      {!loading && results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {results.slice(0, 7).map((song, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-lg bg-gray-100 dark:bg-[#1c1c1c] p-4">
              <img
                src={song.thumbnail || '/placeholder.jpg'}
                alt={song.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <div className="font-bold text-lg truncate">{song.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.artist}</div>
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