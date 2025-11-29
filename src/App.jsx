import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import History from './pages/Profile/History';
import Favourites from './pages/Profile/Favourites';
import Statistics from './pages/Profile/Statistics';
import Settings from './pages/Profile/Settings';

// Layout
import MainLayout from './layouts/MainLayout';

// Stream Pages
import StreamChoice from './pages/Stream';                
import StreamRoom from './pages/Stream/StreamRoom';

// Providers
import { WebSocketProvider } from './context/WebSocketContext';
import { AudioProvider } from './context/AudioProvider';
import { ChatProvider } from './context/ChatContext';

// Firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Context
export const StreamContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [streamId, setStreamId] = useState(null);

  // Listen to Firebase auth state
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

  // Restore stream ID from localStorage
  useEffect(() => {
    const storedStreamId = localStorage.getItem("stream_id");
    if (storedStreamId) setStreamId(storedStreamId);
  }, []);

  // Loading overlay (prevents UI flicker)
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
        <WebSocketProvider streamId={streamId}>
          <ChatProvider streamId={streamId} user={user}>

            <Routes>
              <Route path="/" element={<Landing />} />

              {/* Stream Screens */}
              <Route path="/stream" element={<StreamChoice />} />
              <Route
                path="/stream/room"
                element={<StreamRoom streamId={streamId} user={user} />}
              />

              {/* Protected Routes */}
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
        </WebSocketProvider>
      </AudioProvider>
    </StreamContext.Provider>
  );
}

export default App;
