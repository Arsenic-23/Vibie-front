import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" /> : <Landing />}
      />
      <Route
        path="/home"
        element={isAuthenticated ? <Home /> : <Navigate to="/" />}
      />
      <Route
        path="/explore"
        element={isAuthenticated ? <Explore /> : <Navigate to="/" />}
      />
      <Route
        path="/profile/*"
        element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
      />
    </Routes>
  );
}