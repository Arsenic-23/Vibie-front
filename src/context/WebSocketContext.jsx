// src/context/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFirebaseToken } from "../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;
const WS_PATH = "/realtime/stream"; // same path backend expects

export const WebSocketContext = createContext({
  ws: null,
  isConnected: false,
  connectToStream: () => {},
  disconnect: () => {},
  send: () => {},
});

export function WebSocketProvider({ streamId, children }) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectRef = useRef(true);
  const reconnectTimer = useRef(null);
  const streamRef = useRef(null);

  // ----------------------------------------------------------
  // Build WebSocket URL safely
  // ----------------------------------------------------------
  async function buildWsUrl(id) {
    const token = await getFirebaseToken().catch(() => null);

    let url = API.replace(/^https/, "wss").replace(/^http/, "ws");
    url += `${WS_PATH}/${id}`;

    if (token) return `${url}?token=${encodeURIComponent(token)}`;

    const local = JSON.parse(localStorage.getItem("profile") || "null");
    if (local?.uid) return `${url}?user_id=${encodeURIComponent(local.uid)}`;

    return url;
  }

  // ----------------------------------------------------------
  // Open WebSocket
  // ----------------------------------------------------------
  async function openWS(id) {
    const url = await buildWsUrl(id);
    const ws = new WebSocket(url);

    wsRef.current = ws;
    window.__CHAT_WS__ = ws; // debug helper

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (ev) => {
      // WebSocketContext is not responsible for vibers/chat storage.
      // That is handled by RealtimeContext & ChatContext.
      // We only forward messages if needed.
      try {
        const data = JSON.parse(ev.data);
        console.log("WS message:", data);
      } catch {}
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {}
    };

    ws.onclose = () => {
      setIsConnected(false);

      if (!reconnectRef.current) return;

      reconnectTimer.current = setTimeout(() => {
        if (reconnectRef.current) openWS(id);
      }, 1200);
    };
  }

  // ----------------------------------------------------------
  // Public: connect
  // ----------------------------------------------------------
  async function connectToStream(id) {
    if (!id) return;

    streamRef.current = id;
    reconnectRef.current = true;

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
    }

    await openWS(id);
  }

  // ----------------------------------------------------------
  // Public: disconnect
  // ----------------------------------------------------------
  function disconnect() {
    reconnectRef.current = false;

    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
    }

    wsRef.current = null;
    setIsConnected(false);
  }

  // Auto-clean on unmount
  useEffect(() => {
    return () => disconnect();
  }, []);

  // ----------------------------------------------------------
  // Safe send helper
  // ----------------------------------------------------------
  function send(obj) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify(obj));
  }

  return (
    <WebSocketContext.Provider
      value={{
        ws: wsRef.current,
        isConnected,
        connectToStream,
        disconnect,
        send,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
