import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs, Tab } from './ProfileTabs';
import { UserIcon, MusicIcon, SettingsIcon, PlayCircle } from 'lucide-react';

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

  return (
    <div className="min-h-screen px-4 pt-6 pb-28 bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col gap-10">
      {/* Header */}
      <div className="mb-2 px-2">
        <h1 className="text-3xl font-bold tracking-tight">Viber</h1>
        <div className="w-24 h-1 mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Profile Section */}
        <div className="flex items-center gap-6 bg-gray-100 dark:bg-[#1e1e2f] rounded-2xl p-6 shadow-lg transition-all">
          {/* Profile Ring with Glow */}
          <div className="relative w-36 h-36 shrink-0">
            {/* Blurred Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-xl opacity-40 z-0" />

            {/* Animated Gradient Ring */}
            <div className="absolute inset-0 flex items-center justify-center animate-spinSlow z-10">
              <div className="w-full h-full rounded-full p-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
            </div>

            {/* Profile Image */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-[94%] h-[94%] rounded-full bg-white dark:bg-[#1e1e2f] overflow-hidden">
                <img
                  src={user?.photo || 'https://placehold.co/150x150'}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold tracking-tight">{user?.name || 'Viber'}</h2>
            <p className="text-purple-600 dark:text-violet-400 text-lg mt-1">
              {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 dark:bg-[#2b2b3c] rounded-xl p-4 shadow-inner transition-all">
          <Tabs>
            <Tab icon={<UserIcon className="w-6 h-6" />} label="Profile" />
            <Tab icon={<MusicIcon className="w-6 h-6" />} label="Tracks" />
            <Tab icon={<SettingsIcon className="w-6 h-6" />} label="Settings" />
          </Tabs>
        </div>

        {/* Outlet Section */}
        <div className="bg-white dark:bg-[#1c1c2b] rounded-xl p-6 shadow-md transition-all">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <PlayCircle size={18} className="text-purple-500" />
        <span className="font-semibold">Vibie</span>
      </div>
    </div>
  );
}