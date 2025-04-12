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
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to handle loading state

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = () => {
      return localStorage.getItem('authToken') !== null;
    };
    setIsAuthenticated(checkAuth()); // Set the auth state once check is done
  }, []);

  // Loading state before authentication is determined
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally show a loading indicator or spinner here
  }

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