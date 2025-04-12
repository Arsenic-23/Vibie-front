import React, { useEffect, useState } from 'react'; 
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'; 
import Landing from './pages/Landing'; 
import Home from './pages/Home'; 
import Search from './pages/Search'; 
import Explore from './pages/Explore'; // Import Explore instead of Hits 
import Profile from './pages/Profile'; 
import MainLayout from './layouts/MainLayout';

function App() { 
  const location = useLocation(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLandingPage, setIsLandingPage] = useState(true); // Track if we are on the landing page

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [location.pathname]);

  const checkAuth = () => { 
    return localStorage.getItem('authToken') !== null; 
  };

  useEffect(() => { 
    setIsAuthenticated(checkAuth()); 
  }, []);

  return ( 
    <Routes> 
      {/* Landing page route */} 
      <Route path="/" element={<Landing setIsLandingPage={setIsLandingPage} />} />

      {/* Protect the other routes if on the landing page */}
      {isLandingPage ? (
        <Route path="" element={<Navigate to="/" replace />} />
      ) : (
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/explore" element={<Explore />} /> {/* Explore instead of Hits */}
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />}
          />
        </Route>
      )}
    </Routes>
  ); 
}

export default App;