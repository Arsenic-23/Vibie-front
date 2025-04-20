import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Settings</h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Theme: Light/Dark</li>
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Notifications: On</li>
        <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">Language: English</li>
      </ul>
    </div>
  );
}