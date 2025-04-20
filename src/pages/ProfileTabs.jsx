import React from 'react';
import { NavLink } from 'react-router-dom';
import { History, BarChart2, Heart, Settings } from 'lucide-react';

const tabs = [
  { to: '/profile/history', icon: <History size={20} className="text-blue-500" />, label: 'History' },
  { to: '/profile/statistics', icon: <BarChart2 size={20} className="text-green-500" />, label: 'Stats' },
  { to: '/profile/favourites', icon: <Heart size={20} className="text-pink-500" />, label: 'Faves' },
  { to: '/profile/settings', icon: <Settings size={20} className="text-purple-500" />, label: 'Settings' },
];

export default function ProfileTabs() {
  return (
    <div className="flex flex-col p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Tabs</h2>
      <div className="flex flex-col space-y-2">
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
      </div>
    </div>
  );
}