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
    // try to get token but do not throw
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
      case "full_state":
        setVibers((msg.participants || []).map((p) => ({ ...p })));
        break;

      case "join":
        setVibers((prev) => {
          const exists = prev.some((x) => x.user_id === msg.participant.user_id);
          if (!exists) return [msg.participant, ...prev];
          return prev.map((x) => (x.user_id === msg.participant.user_id ? msg.participant : x));
        });
        break;

      case "leave":
        setVibers((prev) => prev.filter((x) => x.user_id !== msg.user_id));
        break;

      case "update":
        setVibers((prev) => prev.map((x) => (x.user_id === msg.user.user_id ? msg.user : x)));
        break;

      default:
        // forward other messages to app (chat/playback/etc.)
        window.dispatchEvent(new CustomEvent("vibie:ws", { detail: msg }));
        break;
    }
  }

  /* -------------------------
     Watchdog & Ping
     watch for ghost sockets & keep-alive
  --------------------------*/
  function startWatchdog() {
    if (watchdogTimer.current) clearInterval(watchdogTimer.current);

    watchdogTimer.current = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        // attempt immediate reconnect if we should
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
     Connect / open
  --------------------------*/
  async function open(streamId) {
    // if no streamId, nothing to do
    if (!streamId) return;

    // If already connected to same stream, no-op
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

        // when connection is established, send resume + request full state
        try {
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
        } catch {}

        // flush outgoing queue
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
        // error -> ensure socket closes to trigger onclose & reconnect
        try { socket.close(); } catch {}
      };

      socket.onclose = (ev) => {
        wsRef.current = null;
        connecting.current = false;
        setIsConnected(false);

        // cleanup timers
        if (pingTimer.current) clearInterval(pingTimer.current);
        if (watchdogTimer.current) clearInterval(watchdogTimer.current);

        // if we are supposed to reconnect => schedule
        if (shouldReconnect.current && !manualDisconnect.current && streamRef.current) {
          scheduleReconnect();
        } else {
          // if manual disconnect, clear state (we intentionally closed)
          // don't clear stored stream id; leaving stream should be explicit via leaveStream()
        }
      };
    } catch (e) {
      // failure while opening -> schedule reconnect
      connecting.current = false;
      setIsConnected(false);
      if (shouldReconnect.current && !manualDisconnect.current && streamRef.current) scheduleReconnect();
    }
  }

  function scheduleReconnect(immediateDelay = null) {
    if (reconnectTimer.current) return; // already scheduled

    const delay = immediateDelay !== null ? immediateDelay : nextDelay();
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      if (shouldReconnect.current && !manualDisconnect.current && streamRef.current) {
        open(streamRef.current);
      }
    }, delay);
  }

  /* -------------------------
     PUBLIC API: connectToStream
     - marks shouldReconnect true (persistent)
     - stores stream id and opens socket
  --------------------------*/
  async function connectToStream(streamId) {
    if (!streamId) return;

    // store desired stream id (persist across navigation)
    streamRef.current = streamId;
    localStorage.setItem("stream_id", streamId);

    // we want auto reconnect behavior for this stream
    shouldReconnect.current = true;
    manualDisconnect.current = false;

    // ensure existing reconnect timer is cleared so we open immediately
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    // open (no-op if already open to same stream)
    await open(streamId);
  }

  /* -------------------------
     Manual disconnect (user triggered)
     - force=true => stop auto-reconnect permanently until next call to connectToStream
     - if force=false => just close now but allow auto-reconnect
  --------------------------*/
  function disconnect(force = true) {
    // when user intentionally wants to stop persistence
    if (force) {
      manualDisconnect.current = true;
      shouldReconnect.current = false;
      // keep streamRef (so user can re-join manually)
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
    // keep vibers in UI if you want; we keep vibers but you can clear externally
  }

  /* -------------------------
     leaveStream:
     - explicit leave: call backend REST to remove participant, clear local storage and disconnect forcefully
  --------------------------*/
  async function leaveStream() {
    const id = streamRef.current || localStorage.getItem("stream_id");
    if (!id) return;

    try {
      // attempt to call backend leave-ish endpoint if you have one
      // else we just remove local state and disconnect
      const token = await getFirebaseToken().catch(() => null);
      if (token) {
        await fetch(`${API}/stream/leave`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ stream_id: id }),
        }).catch(() => {});
      }
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
      // small timeout so app can finish booting
      setTimeout(() => connectToStream(id), 120);
    }

    // visibility/online handlers to attempt reconnect
    const onVisible = () => {
      if (document.visibilityState === "visible" && shouldReconnect.current && streamRef.current) {
        scheduleReconnect(50);
      }
    };
    const onOnline = () => {
      if (shouldReconnect.current && streamRef.current) scheduleReconnect(50);
    };

    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
      // do NOT disconnect here — provider is app-level and persistent
    };
  }, []);

  /* -------------------------
     Expose context
  --------------------------*/
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
