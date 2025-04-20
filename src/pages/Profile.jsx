import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('history');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setUser({
        id: tgUser.id,
        name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
        username: tgUser.username,
        photo: tgUser.photo_url,
      });
    }
  }, []);

  return (
    <div className="px-4 pt-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user?.photo || 'https://placehold.co/100x100'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold">{user?.name || 'Your Vibe'}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
          {['history', 'statistics', 'favourites', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Listening History</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>Song 1 - Artist</li>
              <li>Song 2 - Artist</li>
              <li>Song 3 - Artist</li>
            </ul>
          </div>
        )}
        {activeTab === 'statistics' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Statistics</h3>
            <p className="text-gray-600 dark:text-gray-300">Total songs played: 1,234</p>
            <p className="text-gray-600 dark:text-gray-300">Total hours listened: 350</p>
          </div>
        )}
        {activeTab === 'favourites' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Favourite Songs</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>Song 1 - Artist</li>
              <li>Song 2 - Artist</li>
              <li>Song 3 - Artist</li>
            </ul>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Settings</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>Theme: Light/Dark</li>
              <li>Notifications: On/Off</li>
              <li>Language: English</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}