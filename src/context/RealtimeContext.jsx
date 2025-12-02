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
  const shouldReconnectRef = useRef(true);
  const pingTimerRef = useRef(null);

  // -------------------------
  // WebSocket URL builder
  // -------------------------
  async function buildWsUrl(streamId) {
    const token = await getFirebaseToken().catch(() => null);

    let url = API.replace(/^http/, "ws");
    url += `${WS_PATH}/${streamId}`;

    if (token) {
      return `${url}?token=${encodeURIComponent(token)}`;
    }

    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    if (profile?.uid) {
      return `${url}?user_id=${encodeURIComponent(profile.uid)}`;
    }

    return url;
  }

  // -------------------------
  // Normalize participants
  // -------------------------
  function normalizeParticipants(list = []) {
    return list.map((v) => ({
      user_id: v.user_id,
      name: v.name,
      username: v.username,
      profile_pic: v.profile_pic,
      is_admin: !!v.is_admin,
      joined_at: v.joined_at || null,
      last_seen_at: v.last_seen_at || null,
    }));
  }

  // -------------------------
  // Message handler
  // -------------------------
  function handleMessage(payload) {
    const type = payload.type;

    if (type === "full_state") {
      setVibers(normalizeParticipants(payload.participants || []));
      if (payload.now_playing !== undefined) {
        setNowPlaying(payload.now_playing);
      }
      if (payload.queue !== undefined) {
        setQueue(payload.queue || []);
      }
    } else if (type === "join") {
      const p = normalizeParticipants([payload.participant])[0];
      setVibers((prev) => {
        if (!p) return prev;
        const exists = prev.some((x) => x.user_id === p.user_id);
        if (exists) {
          return prev.map((x) => (x.user_id === p.user_id ? p : x));
        }
        return [p, ...prev];
      });
    } else if (type === "leave") {
      setVibers((prev) => prev.filter((p) => p.user_id !== payload.user_id));
    } else if (type === "update") {
      const u = normalizeParticipants([payload.user])[0];
      if (!u) return;
      setVibers((prev) =>
        prev.map((p) => (p.user_id === u.user_id ? { ...p, ...u } : p))
      );
    } else if (type === "queue") {
      setQueue(payload.queue || []);
    }
  }

  // -------------------------
  // Open WebSocket for a given streamId
  // -------------------------
  async function openWebSocket(streamId) {
    if (!streamId) return;

    const url = await buildWsUrl(streamId);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        backoffRef.current = RECONNECT_BASE_MS;

        // ask for current state immediately
        ws.send(JSON.stringify({ type: "request_full_state" }));

        // send profile once if we have it
        const local = JSON.parse(localStorage.getItem("profile") || "null");
        if (local) {
          ws.send(
            JSON.stringify({
              type: "update_profile",
              profile: {
                name: local.name,
                profile_pic: local.photo,
                username: local.username,
              },
            })
          );
        }

        // start ping to keep connection alive
        if (pingTimerRef.current) {
          clearInterval(pingTimerRef.current);
        }
        pingTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25000);
      };

      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          handleMessage(payload);
        } catch {
          // ignore malformed payloads
        }
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        if (pingTimerRef.current) {
          clearInterval(pingTimerRef.current);
          pingTimerRef.current = null;
        }

        // if we changed stream or explicitly disconnected, do not reconnect
        if (!shouldReconnectRef.current) {
          return;
        }

        // reconnect only if this close belongs to current stream
        if (streamRef.current === streamId) {
          const delay = backoffRef.current;
          backoffRef.current = Math.min(
            backoffRef.current * 1.8,
            RECONNECT_MAX_MS
          );
          setTimeout(() => {
            // still same stream and still want reconnection
            if (shouldReconnectRef.current && streamRef.current === streamId) {
              openWebSocket(streamId);
            }
          }, delay);
        }
      };
    } catch (e) {
      console.warn("WebSocket connect failed:", e);
    }
  }

  // -------------------------
  // Public API
  // -------------------------
  async function connectToStream(streamId) {
    if (!streamId) return;

    // same stream and ws is open: nothing to do
    if (
      streamRef.current === streamId &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      return;
    }

    // switch to new stream
    streamRef.current = streamId;
    shouldReconnectRef.current = true;

    // close previous socket if any
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    await openWebSocket(streamId);
  }

  function disconnect() {
    shouldReconnectRef.current = false;

    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    streamRef.current = null;
    setVibers([]);
    setNowPlaying(null);
    setQueue([]);
  }

  // -------------------------
  // Auto cleanup on unmount / page unload
  // -------------------------
  useEffect(() => {
    function handleUnload() {
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Profile update API
  // -------------------------
  async function sendProfileUpdate(profile) {
    const ws = wsRef.current;

    // prefer WebSocket update
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "update_profile", profile }));
      return;
    }

    // fallback to HTTP if needed
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
      console.warn("profile update fallback failed", e);
    }
  }

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
        sendProfileUpdate,
        nowPlaying,
        queue,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
