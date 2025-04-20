import React from 'react';

export default function Favourites() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-pink-500 dark:text-pink-400">Your Favourite Songs</h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Fav Song 1 - Artist</li>
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Fav Song 2 - Artist</li>
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Fav Song 3 - Artist</li>
      </ul>
    </div>
  );
}