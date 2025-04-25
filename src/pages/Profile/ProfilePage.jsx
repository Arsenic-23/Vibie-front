import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function ProfilePopup({ onClose }) {
  return (
    <div className="absolute top-14 right-4 z-30 w-56 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-4 rounded-2xl shadow-xl">
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Theme</h4>
        <ThemeToggle />
      </div>
    </div>
  );
}