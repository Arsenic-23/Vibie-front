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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => {
      return localStorage.getItem('authToken') !== null;
    };
    setIsAuthenticated(checkAuth());
  }, []);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      ) : (
        // Redirect all other routes to landing if not authenticated
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
}

export default App;