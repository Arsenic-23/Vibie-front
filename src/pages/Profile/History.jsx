import React from 'react';

export default function History() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Your Listening History</h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Song 1 - Artist</li>
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Song 2 - Artist</li>
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Song 3 - Artist</li>
      </ul>
    </div>
  );
}