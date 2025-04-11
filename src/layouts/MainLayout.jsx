import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all duration-500 pb-20">
      <Outlet />
      <NavigationBar />
    </div>
  );
}