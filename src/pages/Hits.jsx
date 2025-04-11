import React, { useEffect, useState } from 'react';

export default function Hits() {
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    // Simulated API fetch for now
    setTimeout(() => {
      setTopSongs([
        { title: 'Flowers', artist: 'Miley Cyrus' },
        { title: 'Blinding Lights', artist: 'The Weeknd' },
        { title: 'As It Was', artist: 'Harry Styles' },
        { title: 'Levitating', artist: 'Dua Lipa' },
      ]);
    }, 1000);
  }, []);

  return (
    <div className="px-4 pt-6">
      <h2 className="text-2xl font-bold mb-4">Top Hits</h2>
      <ul className="space-y-3">
        {topSongs.map((song, idx) => (
          <li key={idx} className="p-3 rounded-xl shadow dark:bg-gray-800 bg-gray-100">
            <h3 className="font-semibold">{song.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{song.artist}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}