// File: app/src/App.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import History from './pages/Profile/History';
import Favourites from './pages/Profile/Favourites';
import Statistics from './pages/Profile/Statistics';
import Settings from './pages/Profile/Settings';
import MainLayout from './layouts/MainLayout';

import { WebSocketProvider } from './context/WebSocketContext'; // ✅ import it

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const profile = localStorage.getItem('profile');
    if (token && profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  return (
    <WebSocketProvider> {/* ✅ wrap the entire app */}
      <Routes>
        <Route path="/" element={<Landing />} />
        {!user ? (
          <Route path="*" element={<Navigate to="/" replace />} />
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home user={user} />} />
            <Route path="/search" element={<Search user={user} />} />
            <Route path="/explore" element={<Explore user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/profile/history" element={<History />} />
            <Route path="/profile/favourites" element={<Favourites />} />
            <Route path="/profile/statistics" element={<Statistics />} />
            <Route path="/profile/settings" element={<Settings />} />
          </Route>
        )}
      </Routes>
    </WebSocketProvider>
  );
}

export default App;