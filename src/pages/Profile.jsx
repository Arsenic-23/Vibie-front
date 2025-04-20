// File: app/src/pages/Profile.jsx

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProfileTabs from './ProfileTabs';

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
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3c] min-h-screen text-white">
      <div className="relative">
        <img
          src={user?.photo || 'https://placehold.co/100x100'}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-violet-500 pointer-events-none"
          draggable={false}
        />
      </div>
      <h2 className="text-3xl font-semibold mt-4 tracking-tight">{user?.name || 'Your Vibe'}</h2>
      <p className="text-violet-400 mt-1 text-sm">
        {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
      </p>

      <div className="w-full mt-8">
        <ProfileTabs />
        <div className="mt-6 px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}