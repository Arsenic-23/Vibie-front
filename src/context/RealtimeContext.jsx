// src/context/RealtimeContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFirebaseToken } from "../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;
const WS_PATH = "/realtime/stream";

const RECONNECT_BASE = 350;
const RECONNECT_MAX = 15000;
const WATCHDOG_INTERVAL = 14000;
const CLIENT_PING_INTERVAL = 20000;
const MIN_RECONNECT_DELAY = 500; // safety floor

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: (id) => {},
  disconnect: (force = true) => {},
  send: (obj) => {},
  leaveStream: () => {},
  currentStreamId: null,
  isConnected: false,
});

function dedupeList(list) {
  const map = new Map();
  for (const v of list || []) {
    if (!v?.user_id) continue;
    map.set(v.user_id, { ...map.get(v.user_id), ...v });
  }
  return Array.from(map.values());
}

export function RealtimeProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const streamRef = useRef(null); // current stream id we want to be in
  const shouldReconnect = useRef(false); // whether to auto-reconnect
  const manualDisconnect = useRef(false); // explicit user-initiated disconnect
  const reconnectTimer = useRef(null);
  const pingTimer = useRef(null);
  const watchdogTimer = useRef(null);
  const outgoingQueue = useRef([]);
  const connecting = useRef(false);
  const backoff = useRef(0);

  /* -------------------------
     Build WS URL (with token fallback)
  --------------------------*/
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

  /* -------------------------
     Backoff helpers
  --------------------------*/
  function nextDelay() {
    backoff.current = Math.min(backoff.current + 1, 12);
    const base = Math.max(RECONNECT_BASE * Math.pow(1.6, backoff.current), MIN_RECONNECT_DELAY);
    return Math.min(base + Math.random() * 450, RECONNECT_MAX);
  }
  function resetBackoff() {
    backoff.current = 0;
  }

  /* -------------------------
     Send wrapper + outgoing queue
  --------------------------*/
  function send(obj) {
    const ws = wsRef.current;
    const payload = JSON.stringify(obj);

    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(payload);
        return true;
      } catch {
        outgoingQueue.current.push(payload);
        return false;
      }
    } else {
      outgoingQueue.current.push(payload);
      if (outgoingQueue.current.length > 500) outgoingQueue.current.shift();
      return false;
    }
  }

  /* -------------------------
     Message handler
  --------------------------*/
  function handleMessage(msg) {
    if (!msg?.type) return;

    switch (msg.type) {
      case "full_state": {
        const list = Array.isArray(msg.participants) ? msg.participants : [];
        setVibers(dedupeList(list));
        break;
      }

      case "join": {
        const p = msg.participant;
        if (!p?.user_id) return;
        setVibers((prev) => {
          if (prev.some((x) => x.user_id === p.user_id)) {
            // update existing
            return prev.map((x) => (x.user_id === p.user_id ? { ...x, ...p } : x));
          }
          return dedupeList([...prev, p]);
        });
        break;
      }

      case "leave": {
        const userId = msg.user_id;
        if (!userId) return;
        setVibers((prev) => prev.filter((v) => v.user_id !== userId));
        break;
      }

      case "update": {
        const user = msg.user;
        if (!user?.user_id) return;
        setVibers((prev) => prev.map((v) => (v.user_id === user.user_id ? { ...v, ...user } : v)));
        break;
      }

      case "pong":
        // backend pong - no UI action required
        break;

      default:
        // forward other messages (chat/playback) to app
        window.dispatchEvent(new CustomEvent("vibie:ws", { detail: msg }));
        break;
    }
  }

  /* -------------------------
     Watchdog & Ping
  --------------------------*/
  function startWatchdog() {
    if (watchdogTimer.current) clearInterval(watchdogTimer.current);

    watchdogTimer.current = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        if (shouldReconnect.current && streamRef.current) {
          scheduleReconnect(0);
        }
        return;
      }

      try {
        ws.send(JSON.stringify({ type: "ping" }));
      } catch {
        try { ws.close(); } catch {}
      }
    }, WATCHDOG_INTERVAL);
  }

  function startClientPing() {
    if (pingTimer.current) clearInterval(pingTimer.current);
    pingTimer.current = setInterval(() => {
      try {
        send({ type: "ping" });
      } catch {}
    }, CLIENT_PING_INTERVAL);
  }

  /* -------------------------
     Open websocket
  --------------------------*/
  async function open(streamId) {
    if (!streamId) return;

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && streamRef.current === streamId) {
      setIsConnected(true);
      return;
    }

    if (connecting.current) return;
    connecting.current = true;

    try {
      const url = await buildWsUrl(streamId);
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        connecting.current = false;
        resetBackoff();
        setIsConnected(true);

        send({
          type: "resume",
          client_time: Date.now(),
          local_snapshot: {
            last_known_playback_time: window.__LAST_PLAYBACK_TIME__ || 0,
            last_playback_state: window.__LAST_PLAYBACK_STATE__ || "paused",
            profile: JSON.parse(localStorage.getItem("profile") || "null"),
          },
        });
        send({ type: "request_full_state" });

        // flush queue
        while (outgoingQueue.current.length && socket.readyState === WebSocket.OPEN) {
          try {
            socket.send(outgoingQueue.current.shift());
          } catch {
            break;
          }
        }

        startClientPing();
        startWatchdog();
      };

      socket.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          handleMessage(data);
        } catch {}
      };

      socket.onerror = () => {
        try { socket.close(); } catch {}
      };

      socket.onclose = () => {
        wsRef.current = null;
        connecting.current = false;
        setIsConnected(false);

        if (pingTimer.current) {
          clearInterval(pingTimer.current);
          pingTimer.current = null;
        }
        if (watchdogTimer.current) {
          clearInterval(watchdogTimer.current);
          watchdogTimer.current = null;
        }

        if (shouldReconnect.current && !manualDisconnect.current && streamRef.current) {
          scheduleReconnect();
        }
      };
    } finally {
      connecting.current = false;
    }
  }

  function scheduleReconnect(immediateDelay = null) {
    if (reconnectTimer.current) return;
    const delay = immediateDelay !== null ? immediateDelay : nextDelay();
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      if (shouldReconnect.current && !manualDisconnect.current && streamRef.current) {
        open(streamRef.current);
      }
    }, delay);
  }

  /* -------------------------
     Public API: connectToStream
     - If switching streams, first attempt to leave the previous stream via REST (best-effort)
  --------------------------*/
  async function connectToStream(streamId) {
    if (!streamId) return;

    // if same stream and already open, no-op
    if (streamRef.current === streamId && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const prev = streamRef.current || localStorage.getItem("stream_id");

    // If switching streams, attempt to leave previous (best-effort)
    if (prev && prev !== streamId) {
      try {
        // optimistic UI removal
        setVibers([]);
        const token = await getFirebaseToken().catch(() => null);
        await fetch(`${API}/stream/leave`, {
          method: "POST",
          headers: token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" },
          body: JSON.stringify({ stream_id: prev }),
        }).catch(() => {});
      } catch {}
    }

    // set desired stream
    streamRef.current = streamId;
    localStorage.setItem("stream_id", streamId);
    shouldReconnect.current = true;
    manualDisconnect.current = false;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    await open(streamId);
  }

  /* -------------------------
     Manual disconnect (user triggered)
  --------------------------*/
  function disconnect(force = true) {
    if (force) {
      manualDisconnect.current = true;
      shouldReconnect.current = false;
    }

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
    if (watchdogTimer.current) {
      clearInterval(watchdogTimer.current);
      watchdogTimer.current = null;
    }

    try {
      if (wsRef.current) wsRef.current.close();
    } catch {}
    wsRef.current = null;
    setIsConnected(false);
  }

  /* -------------------------
     leaveStream
  --------------------------*/
  async function leaveStream() {
    const id = streamRef.current || localStorage.getItem("stream_id");
    if (!id) return;

    try {
      const token = await getFirebaseToken().catch(() => null);
      await fetch(`${API}/stream/leave`, {
        method: "POST",
        headers: token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" },
        body: JSON.stringify({ stream_id: id }),
      }).catch(() => {});
    } catch {}
    localStorage.removeItem("stream_id");
    streamRef.current = null;
    setVibers([]);
    disconnect(true);
  }

  /* -------------------------
     Auto-connect on app load if stream_id exists
  --------------------------*/
  useEffect(() => {
    const id = localStorage.getItem("stream_id");
    if (id) {
      setTimeout(() => connectToStream(id), 120);
    }

    const onVisible = () => {
      if (document.visibilityState === "visible" && shouldReconnect.current && streamRef.current) scheduleReconnect(50);
    };
    const onOnline = () => {
      if (shouldReconnect.current && streamRef.current) scheduleReconnect(50);
    };

    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
      // Provider is app-level; do not disconnect here
    };
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
        send,
        leaveStream,
        currentStreamId: streamRef.current,
        isConnected,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
