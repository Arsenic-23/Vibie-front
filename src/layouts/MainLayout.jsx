// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import ProfilePopup from '../components/ProfilePopup'; // Import the popup
import { useUIContext } from '../context/UIContext';

export default function MainLayout() {
  const { isSongQueueOpen, isProfilePopupOpen } = useUIContext();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-500 pb-20 relative">
      <Outlet />

      {/* Conditionally render the ProfilePopup */}
      {isProfilePopupOpen && <ProfilePopup />}

      {/* Show nav only when song queue is closed */}
      {!isSongQueueOpen && <NavigationBar />}
    </div>
  );
}