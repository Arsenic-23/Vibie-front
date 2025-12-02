import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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

import StreamChoice from './pages/Stream';
import StreamRoom from './pages/Stream/StreamRoom';

import { AudioProvider } from './context/AudioProvider';
import { ChatProvider } from './context/ChatContext';

// ✅ ADD the correct provider
import { RealtimeProvider } from './context/RealtimeContext';

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const StreamContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [streamId, setStreamId] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile = {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        };

        localStorage.setItem("profile", JSON.stringify(profile));
        setUser(profile);
      } else {
        setUser(null);
      }

      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const storedStreamId = localStorage.getItem("stream_id");
    if (storedStreamId) setStreamId(storedStreamId);
  }, []);

  if (authLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <StreamContext.Provider value={streamId}>
      <AudioProvider>

        {/* ✅ CORRECT REALTIME WS PROVIDER */}
        <RealtimeProvider streamId={streamId}>

          <ChatProvider streamId={streamId} user={user}>
            <Routes>
              <Route path="/" element={<Landing />} />

              <Route path="/stream" element={<StreamChoice />} />
              <Route
                path="/stream/room"
                element={<StreamRoom streamId={streamId} user={user} />}
              />

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
          </ChatProvider>

        </RealtimeProvider>
      </AudioProvider>
    </StreamContext.Provider>
  );
}

export default App;
