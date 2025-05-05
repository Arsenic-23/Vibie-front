import React, { useState, useEffect } from 'react';
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
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      streamLink
    )}&text=${encodeURIComponent('Join my stream on Vibie!')}`;
    window.open(telegramUrl, '_blank');
  };

  // Close popup on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Fullscreen glossy background */}
      <div
        className="fixed inset-0 z-40 bg-white/30 dark:bg-black/30 backdrop-blur-lg transition-opacity"
        onClick={onClose}
      ></div>

      {/* Popup content */}
      <div className="fixed top-16 right-6 z-50 w-80 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-5 rounded-2xl shadow-2xl space-y-5 border border-gray-200 dark:border-gray-800">
        {/* Tab Switch */}
        <div className="flex space-x-2 relative">
          {['theme', 'share'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-sm font-semibold relative px-3 py-2 rounded-xl transition-all duration-200 bg-white/30 dark:bg-white/10 backdrop-blur-sm ${
                activeTab === tab
                  ? 'text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full bg-gradient-to-r from-primary to-secondary animate-[slideUnderline_1s_ease-in-out_1]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Theme Preference
            </h4>
            <ThemeToggle />
          </div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <div className="relative">
            <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">Invite Others</h4>
            <div className="text-xs text-gray-700 dark:text-gray-400 mb-3 break-words bg-gray-100 dark:bg-gray-900 p-2 rounded-md">
              {streamLink}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Copy
              </button>
              <button
                onClick={openTelegramShare}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-secondary transition"
              >
                Share
              </button>
            </div>

            {/* Copy Animation */}
            {copied && (
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-900 px-3 py-0.5 text-[10px] text-gray-800 dark:text-gray-200 rounded-full shadow-md border border-gray-200 dark:border-gray-800 animate-fadeBounce">
                Copied!
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}