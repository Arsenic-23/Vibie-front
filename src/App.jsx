import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
    const token = localStorage.getItem('authToken');
    const profile = localStorage.getItem('profile');
    if (token && profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

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
          <Route path="/profile/*" element={<Profile user={user} />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;