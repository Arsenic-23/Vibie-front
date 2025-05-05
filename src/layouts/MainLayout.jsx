
// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useUIContext } from '../context/UIContext';

export default function MainLayout() {
  const { isSongQueueOpen } = useUIContext();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-500 pb-20">
      <Outlet />
      {!isSongQueueOpen && <NavigationBar />} {/* Only show the NavigationBar when the song queue is not open */}
    </div>
  );
}