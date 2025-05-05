// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import ProfilePopup from '../components/ProfilePopup';
import { useUIContext } from '../context/UIContext';

export default function MainLayout() {
  const { isSongQueueOpen, isProfilePopupOpen, setIsProfilePopupOpen } = useUIContext();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-500 pb-20 relative">
      <Outlet />

      {isProfilePopupOpen && (
        <ProfilePopup onClose={() => setIsProfilePopupOpen(false)} />
      )}

      {!isSongQueueOpen && <NavigationBar />}
    </div>
  );
}