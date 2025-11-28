import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import History from "./pages/Profile/History";
import Favourites from "./pages/Profile/Favourites";
import Statistics from "./pages/Profile/Statistics";
import Settings from "./pages/Profile/Settings";

// Stream pages
import { StreamChoice } from "./pages/Stream";
import StreamRoom from "./pages/Stream/StreamRoom";

// Providers
import { WebSocketProvider } from "./context/WebSocketContext";
import { AudioProvider } from "./context/AudioProvider";
import { ChatProvider } from "./context/ChatProvider";

// Layout
import MainLayout from "./layouts/MainLayout";

// Context
export const StreamContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [streamId, setStreamId] = useState(null);

  useEffect(() => {
    // Restore stream ID
    const storedStreamId = localStorage.getItem("stream_id");
    if (storedStreamId) setStreamId(storedStreamId);

    // Restore user profile
    const profile = localStorage.getItem("profile");
    if (profile) setUser(JSON.parse(profile));

    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const googleData = urlParams.get("user");
    if (googleData) {
      const parsed = JSON.parse(decodeURIComponent(googleData));
      localStorage.setItem("profile", JSON.stringify(parsed));
      setUser(parsed);

      window.history.replaceState({}, document.title, "/stream");
    }
  }, []);

  return (
    <StreamContext.Provider value={streamId}>
      <AudioProvider>
        <WebSocketProvider streamId={streamId}>
          <ChatProvider streamId={streamId} user={user}>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* Stream Pages */}
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
        </WebSocketProvider>
      </AudioProvider>
    </StreamContext.Provider>
  );
}

export default App;
