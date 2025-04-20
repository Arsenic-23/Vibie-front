import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProfileTabs from './ProfileTabs'; // Make sure this path is correct

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setUser({
        id: tgUser.id,
        name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
        username: tgUser.username,
        photo: tgUser.photo_url,
      });
    } else {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setUser(JSON.parse(storedProfile));
      }
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row p-4 md:p-8 space-y-6 md:space-y-0 md:space-x-10">
      {/* Sidebar - Tabs + Profile Info */}
      <div className="md:w-1/4 flex flex-col items-center md:items-start">
        <img
          src={user?.photo || 'https://placehold.co/100x100'}
          alt="Profile"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-md mb-4 pointer-events-none"
          draggable={false}
        />
        <div className="text-center md:text-left mb-6">
          <h2 className="text-2xl font-semibold">{user?.name || 'Your Vibe'}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {user?.username ? `@${user.username}` : 'Welcome back, Viber!'}
          </p>
        </div>

        {/* Tab Navigation */}
        <ProfileTabs />
      </div>

      {/* Main Content - Shows active tab's content */}
      <div className="md:w-3/4">
        <Outlet />
      </div>
    </div>
  );
}