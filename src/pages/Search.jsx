// src/pages/Search.jsx
import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 bg-white dark:bg-[#0c0c1d] text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Search Vibes</h1>
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your vibe... 'Music is what feelings sound like'"
          className="w-full p-4 pl-12 rounded-full shadow-lg bg-gray-100 dark:bg-gray-800 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
      </div>

      {/* Results placeholder */}
      <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
        {query ? `Showing results for "${query}"` : 'Start typing to discover music vibes...'}
      </div>
    </div>
  );
}