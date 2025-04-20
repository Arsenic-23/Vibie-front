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
    <div className="flex flex-col">
      <div className="flex flex-col items-center p-6">
        <img
          src={user?.photo || 'https://placehold.co/100x100'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow-md mb-4 pointer-events-none"
          draggable={false}
        />
        <h2 className="text-2xl font-bold mb-1">{user?.name || 'Your Vibe'}</h2>
        <p className="text-gray-500 dark:text-gray-300 text-sm">
          {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
        </p>
      </div>

      <ProfileTabs />

      {/* Renders the nested tab content */}
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}