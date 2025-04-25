import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Search from './pages/Search';
import Explore from './pages/Explore';
import MainLayout from './layouts/MainLayout';

import ProfilePage from './pages/Profile/ProfilePage';
import History from './pages/Profile/History';
import Favourites from './pages/Profile/Favourites';
import Statistics from './pages/Profile/Statistics';
import Settings from './pages/Profile/Settings';

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const profile = localStorage.getItem('profile');
    if (token && profile) {
      setUser(JSON.parse(profile));
    } else {
      setUser(null);
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {!user ? (
        <Route path="*" element={<Navigate to="/" replace />} />
      ) : (
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/search" element={<Search user={user} />} />
          <Route path="/explore" element={<Explore user={user} />} />

          {/* Profile with nested routes */}
          <Route path="/profile" element={<ProfilePage user={user} />}>
            <Route path="history" element={<History />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      )}
    </Routes>
  );
}

export default App;