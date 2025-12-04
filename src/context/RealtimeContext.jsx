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

const RECONNECT_BASE = 350;
const RECONNECT_MAX = 15000;
const WATCHDOG_INTERVAL = 14000;
const CLIENT_PING_INTERVAL = 20000;
const MIN_RECONNECT_DELAY = 500;

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: () => {},
  disconnect: () => {},
  send: () => {},
  leaveStream: () => {},
  currentStreamId: null,
  isConnected: false,
});

export function RealtimeProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const shouldReconnect = useRef(false);
  const manualDisconnect = useRef(false);

  const reconnectTimer = useRef(null);
  const pingTimer = useRef(null);
  const watchdogTimer = useRef(null);
  const connecting = useRef(false);
  const outgoingQueue = useRef([]);
  const backoff = useRef(0);

  /* -------------------------
     Build WebSocket URL
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
    const base = Math.max(
      RECONNECT_BASE * Math.pow(1.6, backoff.current),
      MIN_RECONNECT_DELAY
    );
    return Math.min(base + Math.random() * 450, RECONNECT_MAX);
  }

  function resetBackoff() {
    backoff.current = 0;
  }

  /* -------------------------
     Send wrapper (with queue)
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
    }

    outgoingQueue.current.push(payload);
    if (outgoingQueue.current.length > 500) outgoingQueue.current.shift();
    return false;
  }

  /* -------------------------
     Perfect message handler
  --------------------------*/
  function handleMessage(msg) {
    if (!msg?.type) return;

    switch (msg.type) {
      /* --------------------------------
         FULL STATE (initial hydration)
      --------------------------------*/
      case "full_state":
        setVibers(msg.participants || []);
        return;

      /* --------------------------------
         JOIN / LEAVE
      --------------------------------*/
      case "join": {
        const p = msg.participant;
        if (!p) return;

        setVibers((prev) => {
          if (prev.some((x) => x.user_id === p.user_id)) return prev;
          return [...prev, p];
        });
        return;
      }

      case "leave": {
        const userId = msg.user_id;
        if (!userId) return;

        setVibers((prev) => prev.filter((v) => v.user_id !== userId));
        return;
      }

      /* --------------------------------
         USER PROFILE UPDATE
      --------------------------------*/
      case "update": {
        const user = msg.user;
        if (!user) return;

        setVibers((prev) =>
          prev.map((v) =>
            v.user_id === user.user_id
              ? { ...v, ...user }
              : v
          )
        );
        return;
      }

      /* --------------------------------
         PING -> update watchdog
      --------------------------------*/
      case "pong":
        return;

      /* --------------------------------
         Unknown -> ignore
      --------------------------------*/
      default:
        return;
    }
  }

  /* -------------------------
     Flush queued messages
  --------------------------*/
  function flushQueue() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    while (outgoingQueue.current.length > 0) {
      const p = outgoingQueue.current.shift();
      try {
        ws.send(p);
      } catch {
        break;
      }
    }
  }

  /* -------------------------
     Setup WebSocket
  --------------------------*/
  async function connectToStream(streamId) {
    if (!streamId) return;

    manualDisconnect.current = false;
    shouldReconnect.current = true;
    streamRef.current = streamId;

    await openWs(streamId);
  }

  /* -------------------------
     Open WebSocket (core)
  --------------------------*/
  async function openWs(streamId) {
    if (connecting.current) return;
    connecting.current = true;

    const wsUrl = await buildWsUrl(streamId);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      connecting.current = false;
      resetBackoff();
      setIsConnected(true);

      flushQueue();

      pingTimer.current = setInterval(() => {
        send({ type: "ping" });
      }, CLIENT_PING_INTERVAL);

      watchdogTimer.current = setInterval(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          forceReconnect();
        }
      }, WATCHDOG_INTERVAL);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        handleMessage(msg);
      } catch {}
    };

    ws.onclose = () => {
      cleanup();
      if (!manualDisconnect.current) scheduleReconnect();
    };

    ws.onerror = () => {
      cleanup();
      if (!manualDisconnect.current) scheduleReconnect();
    };
  }

  /* -------------------------
     Cleanup connection
  --------------------------*/
  function cleanup() {
    setIsConnected(false);

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
    }

    wsRef.current = null;

    if (pingTimer.current) clearInterval(pingTimer.current);
    if (watchdogTimer.current) clearInterval(watchdogTimer.current);
    pingTimer.current = null;
    watchdogTimer.current = null;
  }

  /* -------------------------
     Reconnect logic
  --------------------------*/
  function scheduleReconnect() {
    if (!shouldReconnect.current) return;
    if (reconnectTimer.current) return;

    const delay = nextDelay();
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      if (shouldReconnect.current && streamRef.current) {
        openWs(streamRef.current);
      }
    }, delay);
  }

  function forceReconnect() {
    cleanup();
    scheduleReconnect();
  }

  /* -------------------------
     Manual disconnect
  --------------------------*/
  function disconnect(force = true) {
    manualDisconnect.current = true;
    shouldReconnect.current = false;

    cleanup();

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (force) setVibers([]);
  }

  /* -------------------------
     Leave stream (clear state)
  --------------------------*/
  function leaveStream() {
    disconnect(true);
    streamRef.current = null;
  }

  /* -------------------------
     Cleanup on unmount
  --------------------------*/
  useEffect(() => {
    return () => {
      disconnect(true);
    };
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
        leaveStream,
        send,
        currentStreamId: streamRef.current,
        isConnected,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
