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

const RECONNECT_BASE_MS = 300; // base backoff
const RECONNECT_MAX_MS = 12000;

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: async () => {},
  disconnect: () => {},
  send: () => {},
});

export function RealtimeProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const shouldReconnect = useRef(false);
  const reconnectTimer = useRef(null);
  const pingInterval = useRef(null);

  const outgoingQueue = useRef([]);
  const isConnecting = useRef(false);
  const backoffAttempts = useRef(0);

  function nextBackoff() {
    backoffAttempts.current = Math.min(backoffAttempts.current + 1, 12);
    const exp = RECONNECT_BASE_MS * Math.pow(1.6, backoffAttempts.current);
    const jitter = Math.random() * 400;
    return Math.min(exp + jitter, RECONNECT_MAX_MS);
  }
  function resetBackoff() {
    backoffAttempts.current = 0;
  }

  // build url, forcing fresh token
  async function buildWsUrl(streamId) {
    await getFirebaseToken().catch(() => null);
    const token = await getFirebaseToken().catch(() => null);

    let url = API.replace(/^https/, "wss").replace(/^http/, "ws");
    url += `${WS_PATH}/${streamId}`;

    if (token) return `${url}?token=${encodeURIComponent(token)}`;

    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    if (profile?.uid) return `${url}?user_id=${encodeURIComponent(profile.uid)}`;

    return url;
  }

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

  function sendMessage(obj) {
    try {
      const ws = wsRef.current;
      const payload = JSON.stringify(obj);

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      } else {
        outgoingQueue.current.push(payload);
        if (outgoingQueue.current.length > 300) outgoingQueue.current.shift();
      }
    } catch (e) {
      outgoingQueue.current.push(JSON.stringify(obj));
    }
  }

  function handleMessage(payload) {
    if (!payload?.type) return;

    switch (payload.type) {
      case "full_state":
        setVibers(normalize(payload.participants || []));
        break;

      case "join": {
        const p = normalize([payload.participant])[0];
        if (!p) return;
        setVibers((prev) => {
          const exists = prev.some((x) => x.user_id === p.user_id);
          return exists ? prev.map((x) => (x.user_id === p.user_id ? p : x)) : [p, ...prev];
        });
        break;
      }

      case "leave":
        setVibers((prev) => prev.filter((x) => x.user_id !== payload.user_id));
        break;

      case "update": {
        const u = normalize([payload.user])[0];
        setVibers((prev) => prev.map((x) => (x.user_id === u.user_id ? u : x)));
        break;
      }

      case "pong":
        // server heartbeat
        break;

      case "resumed":
        // server confirms resume
        break;

      default:
        // forward non-presence messages globally; components can listen
        try {
          window.dispatchEvent(new CustomEvent("vibie:ws", { detail: payload }));
        } catch {}
        break;
    }
  }

  async function openWS(streamId) {
    if (isConnecting.current) return;
    isConnecting.current = true;

    try {
      const url = await buildWsUrl(streamId);
      const ws = new WebSocket(url);
      wsRef.current = ws;
      window.__ACTIVE_WS__ = ws;

      ws.onopen = () => {
        resetBackoff();
        isConnecting.current = false;

        const profile = JSON.parse(localStorage.getItem("profile") || "null");
        sendMessage({
          type: "resume",
          client_time: Date.now(),
          local_snapshot: {
            last_known_playback_time: window.__LAST_PLAYBACK_TIME__ || 0,
            last_playback_state: window.__LAST_PLAYBACK_STATE__ || "paused",
            profile,
          },
        });

        sendMessage({ type: "request_full_state" });

        try {
          while (outgoingQueue.current.length > 0 && ws.readyState === WebSocket.OPEN) {
            const p = outgoingQueue.current.shift();
            ws.send(p);
          }
        } catch {}

        if (pingInterval.current) clearInterval(pingInterval.current);
        pingInterval.current = setInterval(() => {
          try {
            sendMessage({ type: "ping" });
          } catch {}
        }, 20000);
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          handleMessage(data);
        } catch {}
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {}
      };

      ws.onclose = () => {
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
          pingInterval.current = null;
        }
        wsRef.current = null;
        isConnecting.current = false;

        if (!shouldReconnect.current) {
          setVibers([]);
          return;
        }

        const delay = nextBackoff();
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
        reconnectTimer.current = setTimeout(() => {
          if (shouldReconnect.current && streamRef.current) {
            openWS(streamRef.current);
          }
        }, delay);
      };
    } finally {
      isConnecting.current = false;
    }
  }

  async function connectToStream(streamId) {
    if (!streamId) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && streamRef.current === streamId) return;
    if (streamRef.current === streamId && isConnecting.current) return;

    streamRef.current = streamId;
    shouldReconnect.current = true;

    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }

    await openWS(streamId);
  }

  function disconnect() {
    shouldReconnect.current = false;
    if (pingInterval.current) { clearInterval(pingInterval.current); pingInterval.current = null; }
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }
    wsRef.current = null;
    streamRef.current = null;
    outgoingQueue.current = [];
    setVibers([]);
    resetBackoff();
  }

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "visible") {
        if (shouldReconnect.current && streamRef.current && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
          setTimeout(() => {
            if (shouldReconnect.current) openWS(streamRef.current);
          }, Math.random() * 300 + 30);
        }
      } else {
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
          pingInterval.current = null;
        }
      }
    }

    function onOnline() {
      if (shouldReconnect.current && streamRef.current) {
        openWS(streamRef.current);
      }
    }

    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useEffect(() => {
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
        send: sendMessage,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
