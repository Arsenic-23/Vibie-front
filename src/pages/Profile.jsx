import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { History, BarChart2, Heart, Settings } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const location = useLocation();

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

  const tabs = [
    { to: 'history', icon: <History size={20} />, label: 'History' },
    { to: 'statistics', icon: <BarChart2 size={20} />, label: 'Stats' },
    { to: 'favourites', icon: <Heart size={20} />, label: 'Faves' },
    { to: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="px-4 pt-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user?.photo || 'https://placehold.co/100x100'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-lg pointer-events-none"
          draggable={false}
        />
        <div>
          <h2 className="text-3xl font-bold">{user?.name || 'Your Vibe'}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-4">
          {tabs.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`
              }
            >
              <span className="mr-2">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Outlet for each subpage */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}