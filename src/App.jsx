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

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    const authToken = localStorage.getItem('authToken');

    if (authToken && profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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