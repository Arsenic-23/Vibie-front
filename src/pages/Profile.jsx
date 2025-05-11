import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { History, BarChart2, Heart, Settings, PlayCircle } from 'lucide-react';

export default function Profile({ user: propUser }) {
  const [user, setUser] = useState(propUser);

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
    { to: '/profile/history', icon: History, color: 'bg-blue-500', label: 'History' },
    { to: '/profile/statistics', icon: BarChart2, color: 'bg-green-500', label: 'Statistics' },
    { to: '/profile/favourites', icon: Heart, color: 'bg-pink-500', label: 'Favourites' },
    { to: '/profile/settings', icon: Settings, color: 'bg-purple-500', label: 'Settings' },
  ];

  const Tab = ({ to, Icon, color, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all 
         ${isActive ? 'bg-indigo-700 text-white' : 'bg-[#2e2e40] text-white hover:bg-indigo-600'}`
      }
    >
      <div className={`w-8 h-8 flex items-center justify-center rounded-md ${color} text-white`}>
        <Icon size={16} />
      </div>
      <span className="text-sm">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen px-4 pt-6 pb-6 bg-black text-white transition-all flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Viber</h1>
        <div className="w-20 h-1 mt-1 bg-purple-500 rounded-full animate-pulse" />
      </div>

      <div className="max-w-md w-full mx-auto flex flex-col gap-6">
        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-[#1e1e2f] rounded-2xl p-4 shadow-md">
          <div className="relative w-16 h-16 shrink-0 rounded-full border-2 border-pink-500 overflow-hidden">
            <img
              src={user?.photo || 'https://placehold.co/150x150'}
              alt="Profile"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || 'Viber'}</h2>
            <p className="text-sm text-purple-300">{user?.username ? `@${user.username}` : 'Welcome back!'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-3">
          {tabs.map(({ to, icon: Icon, color, label }) => (
            <Tab key={to} to={to} Icon={Icon} color={color} label={label} />
          ))}
        </div>

        {/* Outlet */}
        <div className="bg-[#1c1c2b] rounded-xl p-4 shadow-md transition-all">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 flex justify-center items-center gap-2 text-sm text-gray-400">
        <PlayCircle size={18} className="text-purple-500" />
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
}