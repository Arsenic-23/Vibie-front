import React from 'react';

export default function Statistics() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-yellow-500 dark:text-yellow-400">Your Statistics</h3>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-2 text-gray-700 dark:text-gray-300">
        <p>Total songs played: 1,234</p>
        <p>Total hours listened: 350</p>
        <p>Favourite genre: Lo-fi</p>
      </div>
    </div>
  );
}