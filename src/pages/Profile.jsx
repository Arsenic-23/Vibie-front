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
    {
      to: 'history',
      icon: <History size={20} className="text-blue-500" />,
      label: 'History',
    },
    {
      to: 'statistics',
      icon: <BarChart2 size={20} className="text-green-500" />,
      label: 'Stats',
    },
    {
      to: 'favourites',
      icon: <Heart size={20} className="text-pink-500" />,
      label: 'Faves',
    },
    {
      to: 'settings',
      icon: <Settings size={20} className="text-purple-500" />,
      label: 'Settings',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-8 space-y-6 md:space-y-0 md:space-x-10">
      {/* Sidebar - Vertical Tabs */}
      <div className="md:w-1/4 flex flex-col items-center md:items-start">
        {/* Profile Header */}
        <img
          src={user?.photo || 'https://placehold.co/100x100'}
          alt="Profile"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-md mb-4 pointer-events-none"
          draggable={false}
        />
        <div className="text-center md:text-left mb-6">
          <h2 className="text-2xl font-semibold">{user?.name || 'Your Vibe'}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
          </p>
        </div>

        <nav className="flex flex-col w-full space-y-2">
          {tabs.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-800'
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Outlet - Main Content */}
      <div className="md:w-3/4">
        <Outlet />
      </div>
    </div>
  );
}