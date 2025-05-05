// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useUIContext } from '../context/UIContext';

export default function MainLayout() {
  const { isSongQueueOpen, isProfilePopupOpen } = useUIContext();

  const shouldShowNav = !isSongQueueOpen && !isProfilePopupOpen;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-500 pb-20">
      <Outlet />
      {shouldShowNav && <NavigationBar />}
    </div>
  );
}