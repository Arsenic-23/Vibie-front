import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Search from './pages/Search';
import Hits from './pages/Hits';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Sample auth state, replace with actual logic

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Sample check for authentication status (replace with actual logic)
  const checkAuth = () => {
    // Example logic - replace with actual check (localStorage, cookies, etc.)
    return localStorage.getItem('authToken') !== null;
  };

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/hits" element={<Hits />} />
        {/* Profile Route with Authentication Guard */}
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} 
        />
      </Route>
    </Routes>
  );
}

export default App;