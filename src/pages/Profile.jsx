import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs, Tab } from './ProfileTabs';
import { UserIcon, MusicIcon, SettingsIcon } from 'lucide-react';

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
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-100 dark:bg-[#1e1e2f] rounded-2xl p-6 shadow-lg transition-all">
          {/* Animated Gradient Ring */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full shrink-0">
            <div className="absolute inset-0 rounded-full animate-spinSlow">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 p-[3px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#1e1e2f] p-1">
                  <img
                    src={user?.photo || 'https://placehold.co/150x150'}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{user?.name || 'Viber'}</h2>
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
        <span className="font-semibold text-purple-600">Vibie</span>
      </div>
    </div>
  );
}