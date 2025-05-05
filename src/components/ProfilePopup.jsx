import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

export default function ProfilePopup({ onClose }) {
  const [activeTab, setActiveTab] = useState('theme');
  const [copied, setCopied] = useState(false);

  const streamLink = 'https://t.me/vibie_bot/Vibiebot';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(streamLink);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      toast.error('Failed to copy the link.');
    }
  };

  const openTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(streamLink)}&text=${encodeURIComponent('Join my stream on vibie!🚀')}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="absolute top-14 right-4 z-30 w-72 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-4 rounded-2xl shadow-xl space-y-4">
      {/* Tab Switch */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            activeTab === 'theme'
              ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Theme
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            activeTab === 'share'
              ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Share
        </button>
      </div>

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Toggle Theme</h4>
          <ThemeToggle />
        </div>
      )}

      {/* Share Tab */}
      {activeTab === 'share' && (
        <div className="relative">
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
              onClick={openTelegramShare}
              className="px-3 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Share
            </button>
          </div>

          {/* Copy animation */}
          {copied && (
            <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-full bg-white/70 dark:bg-gray-800/70 text-sm text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full shadow-md backdrop-blur-lg animate-fade-in-out">
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}