// src/context/RealtimeContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFirebaseToken } from "../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;
const WS_PATH = "/realtime/stream";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: async () => {},
  disconnect: () => {},
  sendProfileUpdate: async () => {},
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

  // -------------------------
  // Correct WebSocket URL builder
  // -------------------------
  async function _buildWsUrl(streamId) {
    const token = await getFirebaseToken().catch(() => null);

    let url = API.replace(/^http/, "ws");
    url += `${WS_PATH}/${streamId}`;

    if (token) return `${url}?token=${encodeURIComponent(token)}`;

    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    if (profile?.uid) return `${url}?user_id=${encodeURIComponent(profile.uid)}`;

    return url;
  }

  // -------------------------
  // Normalize participants always
  // -------------------------
  function normalize(list = []) {
    return list.map((v) => ({
      user_id: v.user_id,
      name: v.name,
      username: v.username,
      profile_pic: v.profile_pic,
      is_admin: v.is_admin || false,
      joined_at: v.joined_at || null,
      last_seen_at: v.last_seen_at || null,
    }));
  }

  // -------------------------
  // WebSocket message handler
  // -------------------------
  function _handleMessage(payload) {
    const type = payload.type;

    if (type === "full_state") {
      setVibers(normalize(payload.participants));
      if (payload.now_playing) setNowPlaying(payload.now_playing);
      if (payload.queue) setQueue(payload.queue);
    }

    else if (type === "join") {
      const p = normalize([payload.participant])[0];
      setVibers((prev) => {
        if (prev.some((x) => x.user_id === p.user_id)) {
          return prev.map((x) => (x.user_id === p.user_id ? p : x));
        }
        return [p, ...prev];
      });
    }

    else if (type === "leave") {
      setVibers((prev) => prev.filter((p) => p.user_id !== payload.user_id));
    }

    else if (type === "update") {
      const u = normalize([payload.user])[0];
      setVibers((prev) => prev.map((p) => (p.user_id === u.user_id ? u : p)));
    }

    else if (type === "queue") {
      setQueue(payload.queue || []);
    }
  }

  // -------------------------
  // WebSocket Connection
  // -------------------------
  async function _connect(streamId) {
    if (!streamId) return;

    streamRef.current = streamId;

    const url = await _buildWsUrl(streamId);

    try {
      wsRef.current = new WebSocket(url);
      window.__ACTIVE_WS__ = wsRef.current;
    } catch (e) {
      console.warn("WS failed, starting fallback", e);
      _startPollingFallback(streamId);
      return;
    }

    wsRef.current.onopen = () => {
      backoffRef.current = RECONNECT_BASE_MS;

      wsRef.current.send(JSON.stringify({ type: "request_full_state" }));

      const local = JSON.parse(localStorage.getItem("profile") || "null");
      if (local) {
        wsRef.current.send(JSON.stringify({
          type: "update_profile",
          profile: {
            name: local.name,
            profile_pic: local.photo,
            username: local.username,
          }
        }));
      }
    };

    wsRef.current.onmessage = (ev) => {
      const payload = JSON.parse(ev.data);
      _handleMessage(payload);
    };

    wsRef.current.onerror = () => {
      try { wsRef.current.close(); } catch {}
    };

    wsRef.current.onclose = () => {
      wsRef.current = null;
      if (shouldReconnect.current) {
        const delay = backoffRef.current;
        backoffRef.current = Math.min(delay * 1.8, RECONNECT_MAX_MS);
        setTimeout(() => _connect(streamId), delay);
      } else {
        setVibers([]);
      }
    };
  }

  // -------------------------
  // Fallback Polling
  // -------------------------
  let pollTimer = useRef(null);

  function _startPollingFallback(streamId) {
    _stopPolling();

    async function tick() {
      try {
        const token = await getFirebaseToken().catch(() => null);
        const res = await fetch(`${API}/analytics/stream/${streamId}/participants`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        setVibers(normalize(data.participants || []));
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

  // -------------------------
  // Public API
  // -------------------------
  async function connectToStream(streamId) {
    if (streamRef.current === streamId && wsRef.current) return;

    shouldReconnect.current = true;
    _stopPolling();

    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }

    await _connect(streamId);
  }

  function disconnect() {
    shouldReconnect.current = false;
    _stopPolling();

    if (wsRef.current) {
      try { wsRef.current.send(JSON.stringify({ type: "leave" })); } catch {}
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }

    setVibers([]);
    streamRef.current = null;
  }

  // -------------------------
  // Auto leave on page unload
  // -------------------------
  useEffect(() => {
    function handleUnload() {
      try {
        if (wsRef.current) wsRef.current.send(JSON.stringify({ type: "leave" }));
      } catch {}
    }

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      disconnect();
    };
  }, []);

  // -------------------------
  // Update profile
  // -------------------------
  async function sendProfileUpdate(profile) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "update_profile", profile }));
      return;
    }

    try {
      const token = await getFirebaseToken();
      await fetch(`${API}/user/update_profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.warn("profile update failed", e);
    }
  }

  return (
    <RealtimeContext.Provider value={{
      vibers,
      connectToStream,
      disconnect,
      sendProfileUpdate,
      nowPlaying,
      queue,
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
