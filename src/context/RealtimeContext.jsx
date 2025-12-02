// src/context/RealtimeContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getFirebaseToken } from "../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;
const WS_PATH = "/realtime/stream";

const RECONNECT_BASE_MS = 800;
const RECONNECT_MAX_MS = 12000;

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
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const shouldReconnect = useRef(false);
  const reconnectTimer = useRef(null);

  // --------------------------------------------------------------
  // Build WebSocket URL safely for all environments
  // --------------------------------------------------------------
  async function buildWsUrl(streamId) {
    const token = await getFirebaseToken().catch(() => null);

    let url = API.replace(/^https/, "wss").replace(/^http/, "ws");
    url += `${WS_PATH}/${streamId}`;

    if (token) return `${url}?token=${encodeURIComponent(token)}`;

    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    if (profile?.uid) return `${url}?user_id=${encodeURIComponent(profile.uid)}`;

    return url;
  }

  // --------------------------------------------------------------
  // Normalize participants
  // --------------------------------------------------------------
  const normalize = (list = []) =>
    list.map((v) => ({
      user_id: v.user_id,
      name: v.name,
      username: v.username,
      profile_pic: v.profile_pic,
      is_admin: !!v.is_admin,
      joined_at: v.joined_at,
      last_seen_at: v.last_seen_at,
    }));

  // --------------------------------------------------------------
  // Handle WS messages
  // --------------------------------------------------------------
  function handleMessage(payload) {
    if (!payload?.type) return;

    switch (payload.type) {
      case "full_state":
        setVibers(normalize(payload.participants || []));
        break;

      case "join":
        setVibers((prev) => {
          const p = normalize([payload.participant])[0];
          if (!p) return prev;
          const exists = prev.some((x) => x.user_id === p.user_id);
          return exists
            ? prev.map((x) => (x.user_id === p.user_id ? p : x))
            : [p, ...prev];
        });
        break;

      case "leave":
        setVibers((prev) =>
          prev.filter((x) => x.user_id !== payload.user_id)
        );
        break;

      case "update":
        const u = normalize([payload.user])[0];
        setVibers((prev) =>
          prev.map((x) => (x.user_id === u.user_id ? u : x))
        );
        break;

      default:
        break;
    }
  }

  // --------------------------------------------------------------
  // Open WebSocket
  // --------------------------------------------------------------
  async function openWS(streamId) {
    const url = await buildWsUrl(streamId);

    const ws = new WebSocket(url);
    wsRef.current = ws;
    window.__ACTIVE_WS__ = ws; // Debug helper

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "request_full_state" }));
    };

    ws.onmessage = (ev) => {
      try {
        handleMessage(JSON.parse(ev.data));
      } catch {}
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {}
    };

    ws.onclose = () => {
      if (!shouldReconnect.current) return;

      reconnectTimer.current = setTimeout(() => {
        if (shouldReconnect.current) openWS(streamId);
      }, Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 1.8));
    };
  }

  // --------------------------------------------------------------
  // Public connect
  // --------------------------------------------------------------
  async function connectToStream(streamId) {
    if (!streamId) return;

    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      streamRef.current === streamId
    ) {
      return;
    }

    streamRef.current = streamId;
    shouldReconnect.current = true;

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
    }

    await openWS(streamId);
  }

  // --------------------------------------------------------------
  // Public disconnect
  // --------------------------------------------------------------
  function disconnect() {
    shouldReconnect.current = false;
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
    }
    wsRef.current = null;

    setVibers([]);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
