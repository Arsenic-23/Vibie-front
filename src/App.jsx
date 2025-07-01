
import React, { useEffect, useState, createContext } from 'react';
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
import { WebSocketProvider } from './context/WebSocketContext';

export const StreamContext = createContext(null);

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [streamId, setStreamId] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready?.();

    const startParam = tg?.initDataUnsafe?.start_param;
    if (startParam) {
      console.log('✅ Deep link stream_id:', startParam);
      setStreamId(startParam);
    }

    const profile = localStorage.getItem('profile');
    if (profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  return (
    <StreamContext.Provider value={streamId}>
      <WebSocketProvider streamId={streamId}>
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
    </StreamContext.Provider>
  );
}

export default App;
