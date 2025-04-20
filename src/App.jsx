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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Detect Telegram Mini App user on load
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;
    if (telegramUser) {
      setUser(telegramUser);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />

      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/" replace />} />
      ) : (
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