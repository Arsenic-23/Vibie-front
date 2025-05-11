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
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 text-black dark:text-white flex flex-col items-center p-4 gap-4 overflow-hidden">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Viber</h1>
        <div className="w-20 h-1 mt-1 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full animate-pulse" />
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-md flex flex-col items-center bg-gray-100 dark:bg-[#1e1e2f] rounded-2xl p-4 shadow-md">
        {/* Profile Ring */}
        <div className="relative w-28 h-28 mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-xl opacity-30 z-0" />
          <div className="absolute inset-0 flex items-center justify-center animate-spinSlow z-10">
            <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-[94%] h-[94%] rounded-full overflow-hidden bg-white dark:bg-[#1e1e2f]">
              <img
                src={user?.photo || 'https://placehold.co/150x150'}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold">{user?.name || 'Viber'}</h2>
        <p className="text-purple-600 dark:text-violet-400 text-sm">
          {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-md bg-gray-100 dark:bg-[#2b2b3c] rounded-xl p-3 shadow-inner">
        <Tabs>
          <Tab icon={<UserIcon className="w-5 h-5" />} label="Profile" />
          <Tab icon={<MusicIcon className="w-5 h-5" />} label="Tracks" />
          <Tab icon={<SettingsIcon className="w-5 h-5" />} label="Settings" />
        </Tabs>
      </div>

      {/* Outlet Section */}
      <div className="w-full max-w-md bg-white dark:bg-[#1c1c2b] rounded-xl p-4 shadow-md overflow-y-auto flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
        <PlayCircle size={16} className="text-purple-500" />
        <span className="font-medium">Vibie</span>
      </div>
    </div>
  );
}