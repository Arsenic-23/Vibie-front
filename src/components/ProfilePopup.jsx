// src/components/ProfilePopup.jsx
import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

export default function ProfilePopup({ onClose }) {
  const [activeTab, setActiveTab] = useState('theme');
  const popupRef = useRef(null);

  const streamLink = 'https://t.me/vibie_bot/Vibiebot';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(streamLink);
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

  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4 bg-transparent">
      {/* Popup */}
      <div
        ref={popupRef}
        className="w-72 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-5 rounded-2xl shadow-2xl space-y-5 border border-gray-200 dark:border-gray-800 animate-popBounce z-50"
      >
        {/* Tabs */}
        <div className="flex space-x-1 relative">
          {['theme', 'share'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs font-medium relative px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 rounded-full animate-gradientMove" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'theme' && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Theme Preference</h4>
            <ThemeToggle />
          </div>
        )}

        {activeTab === 'share' && (
          <div className="relative">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Invite Others</h4>
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

      {/* Animations & Styles */}
      <style jsx>{`
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

        @keyframes popBounce {
          0% {
            transform: translateY(-15px) scale(0.97);
            opacity: 0;
          }
          60% {
            transform: translateY(5px) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        .animate-popBounce {
          animation: popBounce 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}