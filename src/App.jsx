import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Show loading while fetching user data

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Detect Telegram Mini App user on load
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    if (telegramUser) {
      setUser(telegramUser);
      localStorage.setItem('profile', JSON.stringify(telegramUser));
      localStorage.setItem('authToken', 'fake-token'); // You can replace it with real token later
    } else {
      setIsLoading(false); // No user detected, stop loading
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* Route for Landing page, passes user info if authenticated */}
      <Route path="/" element={<Landing />} />

      {!isAuthenticated ? (
        // Redirect to the Landing page if the user is not authenticated
        <Route path="*" element={<Navigate to="/" replace />} />
      ) : (
        // Render main routes only for authenticated users
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/search" element={<Search user={user} />} />
          <Route path="/explore" element={<Explore user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;