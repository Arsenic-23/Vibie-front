import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import axios from 'axios';

export default function Suggestions({ query, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query) return setSuggestions([]);

    const fetchSuggestions = debounce(async () => {
      try {
        const res = await axios.get('
https://backendvibie.onrender.com/suggest/', {
          params: { q: query },
        });
        setSuggestions(res.data.results || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);

    fetchSuggestions();
    return () => fetchSuggestions.cancel?.();
  }, [query]);

  return (
    <div className="mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 overflow-hidden max-w-xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 hover:bg-purple-100 dark:hover:bg-purple-800 cursor-pointer transition-all text-sm"
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}