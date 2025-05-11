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
        `flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${isActive ? 'bg-indigo-700 text-white' : 'bg-[#2e2e40] text-gray-300 hover:bg-indigo-600'}`
      }
    >
      <div className={`w-8 h-8 flex items-center justify-center rounded-md ${color} text-white`}>
        <Icon size={16} />
      </div>
      <span className="tracking-tight">{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen px-4 pt-6 pb-4 bg-black text-white flex flex-col items-center gap-8">
      {/* Header */}
      <div className="w-full max-w-md px-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Viber</h1>
        <div className="w-24 h-1 mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full animate-pulse" />
      </div>

      {/* Profile */}
      <div className="w-full max-w-md flex items-center gap-4 bg-[#1e1e2f] rounded-2xl p-4 shadow-md">
        <div className="relative w-20 h-20 shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-md opacity-50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center animate-spinSlow">
            <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[92%] h-[92%] rounded-full bg-black overflow-hidden">
              <img
                src={user?.photo || 'https://placehold.co/150x150'}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">{user?.name || 'Viber'}</h2>
          <p className="text-violet-400 text-sm">
            {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md flex flex-col gap-3 px-2">
        {tabs.map(({ to, icon: Icon, color, label }) => (
          <Tab key={to} to={to} Icon={Icon} color={color} label={label} />
        ))}
      </div>

      {/* Outlet */}
      <div className="w-full max-w-md px-2">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-center items-center text-sm text-gray-400">
        <PlayCircle size={16} className="text-purple-500 mr-1" />
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
}