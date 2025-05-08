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
    <div className="flex justify-center gap-4 flex-wrap">
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
        `flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 text-base font-semibold 
         shadow-md hover:scale-105 ${
           isActive
             ? 'bg-indigo-700 text-white'
             : 'bg-[#2e2e40] text-gray-300 hover:bg-indigo-600'
         }`
      }
    >
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${color} text-white`}>
        <Icon size={20} />
      </div>
      <span className="tracking-tight">{label}</span>
    </NavLink>
  );
}