// File: app/src/pages/Profile.jsx

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
    <div className="bg-gradient-to-br from-[#12121c] to-[#1c1c2b] min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Profile Section */}
        <div className="flex items-center gap-6 bg-[#1e1e2f] rounded-2xl p-6 shadow-lg">
          {/* Profile Image with animated gradient ring */}
          <div className="relative w-36 h-36 rounded-full">
            <div className="absolute inset-0 rounded-full animate-spin-slow bg-gradient-to-br from-violet-500 via-purple-600 to-violet-500 p-[3px]">
              <div className="w-full h-full rounded-full bg-[#1e1e2f] p-1">
                <img
                  src={user?.photo || 'https://placehold.co/150x150'}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold tracking-tight">{user?.name || 'Your Vibe'}</h2>
            <p className="text-violet-400 text-lg mt-1">
              {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#2b2b3c] rounded-xl p-4 shadow-inner">
          <Tabs>
            <Tab icon={<UserIcon className="w-6 h-6" />} label="Profile" />
            <Tab icon={<MusicIcon className="w-6 h-6" />} label="Tracks" />
            <Tab icon={<SettingsIcon className="w-6 h-6" />} label="Settings" />
          </Tabs>
        </div>

        {/* Outlet Section */}
        <div className="bg-[#1c1c2b] rounded-xl p-6 shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}