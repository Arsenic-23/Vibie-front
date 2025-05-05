import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function ProfilePopup({ onClose }) {
  const streamLink = 'https://t.me/vibie_bot?startapp';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(streamLink);
      alert('Link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy the link.');
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Stream',
          url: streamLink,
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      alert('Web Share API not supported on this browser.');
    }
  };

  return (
    <div className="absolute top-14 right-4 z-30 w-64 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-4 rounded-2xl shadow-xl space-y-4">
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Theme</h4>
        <ThemeToggle />
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Share Stream</h4>
        <div className="text-xs text-gray-600 dark:text-gray-400 break-words mb-2">{streamLink}</div>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Copy
          </button>
          <button
            onClick={shareLink}
            className="px-3 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}