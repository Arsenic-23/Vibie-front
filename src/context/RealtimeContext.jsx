// src/context/RealtimeContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFirebaseToken, getFirebaseUser } from "../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;
const WS_PATH = "/realtime/stream"; // matches backend
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: async () => {},
  disconnect: () => {},
  sendProfileUpdate: async (profile) => {},
  nowPlaying: null,
  queue: [],
});

export function RealtimeProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [queue, setQueue] = useState([]);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const backoffRef = useRef(RECONNECT_BASE_MS);
  const shouldReconnect = useRef(true);

  // helper to build ws url with token
  async function _buildWsUrl(streamId) {
    const token = await getFirebaseToken().catch(() => null);
    const urlBase = API.replace(/^http/, window.location.protocol === "https:" ? "wss" : "ws");
    if (token) {
      return `${urlBase}${WS_PATH}/${streamId}?token=${encodeURIComponent(token)}`;
    }
    // fallback dev: attempt with stored profile uid
    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    if (profile?.uid) {
      return `${urlBase}${WS_PATH}/${streamId}?user_id=${encodeURIComponent(profile.uid)}`;
    }
    return `${urlBase}${WS_PATH}/${streamId}`;
  }

  function _handleMessage(payload) {
    const type = payload.type;
    if (type === "full_state") {
      setVibers(payload.participants || []);
      if (payload.now_playing) setNowPlaying(payload.now_playing);
      if (payload.queue) setQueue(payload.queue);
    } else if (type === "join") {
      setVibers((prev) => {
        if (prev.find((p) => p.user_id === payload.participant.user_id)) {
          return prev.map(p => p.user_id === payload.participant.user_id ? payload.participant : p);
        }
        return [payload.participant, ...prev];
      });
    } else if (type === "leave") {
      setVibers((prev) => prev.filter((p) => p.user_id !== payload.user_id));
    } else if (type === "update") {
      setVibers((prev) => prev.map((p) => (p.user_id === payload.user.user_id ? payload.user : p)));
    } else if (type === "now_playing") {
      setNowPlaying(payload);
    } else if (type === "queue") {
      setQueue(payload.queue || []);
    } else if (type === "error") {
      console.warn("Realtime error:", payload.message);
    }
  }

  async function _connect(streamId) {
    if (!streamId) return;
    streamRef.current = streamId;
    const url = await _buildWsUrl(streamId);

    try {
      wsRef.current = new WebSocket(url);
    } catch (e) {
      console.warn("Failed opening WS", e);
      _startPollingFallback(streamId);
      return;
    }

    wsRef.current.onopen = () => {
      backoffRef.current = RECONNECT_BASE_MS;
      // request full state explicitly
      wsRef.current.send(JSON.stringify({ type: "request_full_state" }));

      // also send a lightweight "update_profile" if we have local profile cached
      const local = JSON.parse(localStorage.getItem("profile") || "null");
      if (local) {
        wsRef.current.send(JSON.stringify({ type: "update_profile", profile: {
          name: local.name,
          profile_pic: local.photo,
          username: local.username,
        }}));
      }
    };

    wsRef.current.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        _handleMessage(payload);
      } catch (e) {
        console.warn("Bad realtime payload", e);
      }
    };

    wsRef.current.onclose = (ev) => {
      wsRef.current = null;
      if (shouldReconnect.current) {
        // exponential backoff
        const delay = backoffRef.current;
        backoffRef.current = Math.min(backoffRef.current * 1.8, RECONNECT_MAX_MS);
        setTimeout(() => _connect(streamId), delay);
      } else {
        // clear state if not reconnecting
        setVibers([]);
      }
    };

    wsRef.current.onerror = () => {
      try { wsRef.current.close(); } catch (e) {}
    };
  }

  // polling fallback when WS doesn't open (keeps in sync)
  let pollTimer = useRef(null);
  function _startPollingFallback(streamId) {
    _stopPolling();
    async function tick() {
      try {
        const token = await getFirebaseToken().catch(() => null);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API}/analytics/stream/${streamId}/participants`, { headers });
        if (!res.ok) throw new Error("poll failed");
        const data = await res.json();
        setVibers(data.participants || []);
      } catch (e) {
        console.warn("poll failed", e);
      }
    }
    tick();
    pollTimer.current = setInterval(tick, 5000);
  }
  function _stopPolling() {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }

  async function connectToStream(streamId) {
    shouldReconnect.current = true;
    _stopPolling();
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    await _connect(streamId);
  }

  function disconnect() {
    shouldReconnect.current = false;
    _stopPolling();
    if (wsRef.current) {
      try {
        // notify server we are leaving (best-effort)
        wsRef.current.send(JSON.stringify({ type: "leave" }));
      } catch (e) { /* ignore */ }
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    streamRef.current = null;
    setVibers([]);
  }

  // ensure we leave on page unload
  useEffect(() => {
    function handleUnload() {
      try {
        if (wsRef.current) wsRef.current.send(JSON.stringify({ type: "leave" }));
      } catch (e) {}
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      disconnect();
    };
  }, []);

  // helper for profile update
  async function sendProfileUpdate(profile) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "update_profile", profile }));
    } else {
      // fallback: call HTTP endpoint (if you have one) to update DB and then server will broadcast
      try {
        const token = await getFirebaseToken();
        await fetch(`${API}/user/update_profile`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
      } catch (e) {
        console.warn("profile update failed", e);
      }
    }
  }

  return (
    <RealtimeContext.Provider value={{
      vibers,
      connectToStream,
      disconnect,
      sendProfileUpdate,
      nowPlaying,
      queue
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
