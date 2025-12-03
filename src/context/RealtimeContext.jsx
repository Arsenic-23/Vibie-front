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
const WATCHDOG_INTERVAL = 14000; // ensure liveness
const CLIENT_PING_INTERVAL = 20000;

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: () => {},
  disconnect: () => {},
  send: () => {},
});

export function RealtimeProvider({ children }) {
  const [vibers, setVibers] = useState([]);

  const wsRef = useRef(null);
  const streamRef = useRef(null);

  const shouldReconnect = useRef(false);
  const reconnectTimer = useRef(null);
  const pingTimer = useRef(null);
  const watchdogTimer = useRef(null);

  const outgoingQueue = useRef([]);
  const connecting = useRef(false);
  const backoff = useRef(0);

  /* -------------------------------------------------
     TOKEN + URL
  -------------------------------------------------- */
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

  function nextDelay() {
    backoff.current = Math.min(backoff.current + 1, 12);
    const base = RECONNECT_BASE * Math.pow(1.6, backoff.current);
    return Math.min(base + Math.random() * 450, RECONNECT_MAX);
  }

  function resetBackoff() {
    backoff.current = 0;
  }

  /* -------------------------------------------------
     SEND
  -------------------------------------------------- */
  function send(obj) {
    const ws = wsRef.current;
    const payload = JSON.stringify(obj);

    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(payload);
      } catch {
        outgoingQueue.current.push(payload);
      }
    } else {
      outgoingQueue.current.push(payload);
      if (outgoingQueue.current.length > 300) outgoingQueue.current.shift();
    }
  }

  /* -------------------------------------------------
     MESSAGE HANDLER
  -------------------------------------------------- */
  function handleMessage(msg) {
    if (!msg?.type) return;

    switch (msg.type) {
      case "full_state":
        setVibers((msg.participants || []).map(p => ({ ...p })));
        break;

      case "join":
        setVibers(prev => {
          const exists = prev.some(x => x.user_id === msg.participant.user_id);
          if (!exists) return [msg.participant, ...prev];
          return prev.map(x => x.user_id === msg.participant.user_id ? msg.participant : x);
        });
        break;

      case "leave":
        setVibers(prev => prev.filter(x => x.user_id !== msg.user_id));
        break;

      case "update":
        setVibers(prev =>
          prev.map(x => (x.user_id === msg.user.user_id ? msg.user : x))
        );
        break;

      default:
        window.dispatchEvent(new CustomEvent("vibie:ws", { detail: msg }));
        break;
    }
  }

  /* -------------------------------------------------
     WATCHDOG — DETECT GHOST SOCKETS
  -------------------------------------------------- */
  function startWatchdog() {
    if (watchdogTimer.current) clearInterval(watchdogTimer.current);

    watchdogTimer.current = setInterval(() => {
      const ws = wsRef.current;

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        if (shouldReconnect.current && streamRef.current) {
          open(streamRef.current);
        }
        return;
      }

      try {
        ws.send(JSON.stringify({ type: "ping" }));
      } catch {
        ws.close();
      }
    }, WATCHDOG_INTERVAL);
  }

  /* -------------------------------------------------
     CLIENT PING
  -------------------------------------------------- */
  function startClientPing() {
    if (pingTimer.current) clearInterval(pingTimer.current);

    pingTimer.current = setInterval(() => {
      try {
        send({ type: "ping" });
      } catch {}
    }, CLIENT_PING_INTERVAL);
  }

  /* -------------------------------------------------
     OPEN WEBSOCKET
  -------------------------------------------------- */
  async function open(streamId) {
    if (connecting.current) return;
    connecting.current = true;

    try {
      const url = await buildWsUrl(streamId);

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        connecting.current = false;
        resetBackoff();

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

        while (outgoingQueue.current.length && ws.readyState === WebSocket.OPEN) {
          ws.send(outgoingQueue.current.shift());
        }

        startClientPing();
        startWatchdog();
      };

      ws.onmessage = e => {
        try {
          const data = JSON.parse(e.data);
          handleMessage(data);
        } catch {}
      };

      ws.onerror = () => {
        try { ws.close(); } catch {}
      };

      ws.onclose = () => {
        wsRef.current = null;
        connecting.current = false;

        if (pingTimer.current) clearInterval(pingTimer.current);
        if (watchdogTimer.current) clearInterval(watchdogTimer.current);

        if (!shouldReconnect.current) {
          setVibers([]);
          return;
        }

        const delay = nextDelay();
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);

        reconnectTimer.current = setTimeout(() => {
          if (shouldReconnect.current && streamRef.current) {
            open(streamRef.current);
          }
        }, delay);
      };
    } finally {
      connecting.current = false;
    }
  }

  /* -------------------------------------------------
     PUBLIC API
  -------------------------------------------------- */
  async function connectToStream(id) {
    if (!id) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && streamRef.current === id) return;

    streamRef.current = id;
    shouldReconnect.current = true;

    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }

    open(id);
  }

  function disconnect() {
    shouldReconnect.current = false;

    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    if (pingTimer.current) clearInterval(pingTimer.current);
    if (watchdogTimer.current) clearInterval(watchdogTimer.current);

    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }

    wsRef.current = null;
    streamRef.current = null;
    outgoingQueue.current = [];
    setVibers([]);
    resetBackoff();
  }

  /* -------------------------------------------------
     VISIBILITY + NETWORK RECOVERY
  -------------------------------------------------- */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const ws = wsRef.current;

        // ghost socket detection
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          setTimeout(() => {
            if (shouldReconnect.current && streamRef.current) open(streamRef.current);
          }, 100);
        } else {
          try { ws.send(JSON.stringify({ type: "ping" })); } catch {}
        }
      }
    };

    const handleOnline = () => {
      if (shouldReconnect.current && streamRef.current) {
        open(streamRef.current);
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  /* -------------------------------------------------
     CLEANUP
  -------------------------------------------------- */
  useEffect(() => disconnect, []);

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
        send,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
