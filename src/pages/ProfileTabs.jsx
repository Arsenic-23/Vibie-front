import React from 'react';
import { NavLink } from 'react-router-dom';
import { History, BarChart2, Heart, Settings } from 'lucide-react';

const tabs = [
  { to: '/profile/history', icon: History, color: 'bg-blue-500', label: 'History' },
  { to: '/profile/statistics', icon: BarChart2, color: 'bg-green-500', label: 'Stats' },
  { to: '/profile/favourites', icon: Heart, color: 'bg-pink-500', label: 'Faves' },
  { to: '/profile/settings', icon: Settings, color: 'bg-purple-500', label: 'Settings' },
];

export function Tabs() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
      {tabs.map(({ to, icon: Icon, color, label }) => (
        <Tab key={to} to={to} Icon={Icon} color={color} label={label} />
      ))}
    </div>
  );
}

export function Tab({ to, Icon, color, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 p-4 rounded-lg transition-all duration-200 font-medium shadow-sm
         ${isActive ? 'bg-indigo-700 text-white' : 'bg-[#2e2e40] text-gray-300 hover:bg-indigo-600'}`
      }
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-md ${color} text-white`}>
        <Icon size={20} />
      </div>
      <span className="text-lg tracking-tight">{label}</span>
    </NavLink>
  );
}