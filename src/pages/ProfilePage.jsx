import React, { useState, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';

export default function Profile() {
  const [userPhoto, setUserPhoto] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.photo_url) {
      setUserPhoto(tgUser.photo_url);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 pt-6 transition-colors duration-300">
      {/* Header with profile photo */}
      <div className="flex justify-end items-center relative mb-6">
        <img
          src={userPhoto || "https://placehold.co/40x40"}
          alt="Profile"
          className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowProfilePopup(prev => !prev)}
        />

        {showProfilePopup && (
          <div className="absolute top-14 right-0 z-30 w-64 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-5 rounded-3xl shadow-2xl space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Profile</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage your account and preferences.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Theme</h4>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>

      {/* Main Profile Content */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold">Welcome to your profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">More options and settings coming soon.</p>
      </div>
    </div>
  );
}