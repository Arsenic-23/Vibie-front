import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';
import { useUIContext } from '../context/UIContext';

export default function ProfilePopup() {
  const { setIsProfilePopupOpen } = useUIContext();
  const [activeTab, setActiveTab] = useState('theme');
  const [copied, setCopied] = useState(false);

  const streamLink = 'https://t.me/vibie_bot/Vibiebot';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(streamLink);
      setCopied(true);
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

  const handleClose = () => {
    setIsProfilePopupOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Dynamic Island-style Copied Tab */}
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-sm text-black dark:text-white rounded-full shadow-lg border border-white/30 dark:border-gray-600/40 animate-slideBounce">
          Link Copied!
        </div>
      )}

      {/* Centered Popup */}
      <div
        className="fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-50 w-80 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-6 rounded-2xl shadow-2xl space-y-6 border border-gray-200 dark:border-gray-800 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex space-x-2 relative">
          {['theme', 'share'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-sm font-semibold relative px-3 py-2 rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? 'text-black dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 rounded-full animate-gradientMove" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'theme' && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">Theme Preference</h4>
            <ThemeToggle />
          </div>
        )}

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
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:brightness-110 transition shadow"
              >
                Share
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animations and Styles */}
      <style>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        .animate-gradientMove {
          background-image: linear-gradient(90deg, #a855f7, #ec4899, #8b5cf6);
          background-size: 200% 200%;
          animation: gradientMove 1.5s linear infinite;
        }

        @keyframes slideBounce {
          0% {
            transform: translateY(-20px) scale(0.95);
            opacity: 0;
          }
          60% {
            transform: translateY(8px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        .animate-slideBounce {
          animation: slideBounce 0.5s ease-out;
        }
      `}</style>
    </>
  );
}