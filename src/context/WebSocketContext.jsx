import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const API = import.meta.env.VITE_BACKEND_URL;
const POLL_INTERVAL_MS = 5000;

const WebSocketContext = createContext({
  vibers: [],
  connectToStream: () => {},
  disconnect: () => {},
  setVibers: () => {},
});

export function WebSocketProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const wsRef = useRef(null);
  const pollRef = useRef(null);
  const currentStreamRef = useRef(null);

  async function fetchParticipants(streamId) {
    try {
      const res = await fetch(`${API}/analytics/stream/${streamId}/participants`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load participants');
      const data = await res.json();
      setVibers(data.participants || []);
    } catch (e) {
      console.warn('Participants fetch failed', e);
    }
  }

  function startPolling(streamId) {
    stopPolling();
    pollRef.current = setInterval(() => fetchParticipants(streamId), POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function connectWS(streamId) {
    // Try to open a WebSocket. If it fails within 2s, fall back to polling.
    try {
      const wsUrl = `${API.replace(/^http/, 'ws')}/ws/streams/${streamId}`;
      wsRef.current = new WebSocket(wsUrl);

      let opened = false;
      const openTimer = setTimeout(() => {
        if (!opened) {
          // assume WS won't open, fallback
          try { wsRef.current.close(); } catch (e) {}
          wsRef.current = null;
          fetchParticipants(streamId);
          startPolling(streamId);
        }
      }, 2000);

      wsRef.current.onopen = () => {
        opened = true;
        clearTimeout(openTimer);
        stopPolling();
        // request initial participants
        wsRef.current.send(JSON.stringify({ type: 'get_participants', stream_id: streamId }));
      };

      wsRef.current.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          // expected message shapes: { type: 'participants', participants: [...] }
          // or incremental: { type: 'join', participant: {...} } / { type: 'leave', user_id: '...' }
          if (payload.type === 'participants') {
            setVibers(payload.participants || []);
          } else if (payload.type === 'join') {
            setVibers((prev) => {
              const exists = prev.find((p) => p.user_id === payload.participant.user_id);
              if (exists) return prev.map(p => p.user_id === exists.user_id ? payload.participant : p);
              return [payload.participant, ...prev];
            });
          } else if (payload.type === 'leave') {
            setVibers((prev) => prev.filter((p) => p.user_id !== payload.user_id));
          } else if (payload.type === 'update') {
            setVibers((prev) => prev.map((p) => (p.user_id === payload.user.user_id ? payload.user : p)));
          }
        } catch (e) {
          console.warn('Bad WS message', e);
        }
      };

      wsRef.current.onclose = () => {
        wsRef.current = null;
        // fallback to polling
        if (currentStreamRef.current) startPolling(currentStreamRef.current);
      };

      wsRef.current.onerror = () => {
        try { wsRef.current.close(); } catch (e) {}
        wsRef.current = null;
        if (currentStreamRef.current) startPolling(currentStreamRef.current);
      };

    } catch (e) {
      console.warn('WS connection failed', e);
      fetchParticipants(streamId);
      startPolling(streamId);
    }
  }

  function connectToStream(streamId) {
    if (!streamId) return;
    currentStreamRef.current = streamId;
    // initial fetch
    fetchParticipants(streamId);
    connectWS(streamId);
  }

  function disconnect() {
    currentStreamRef.current = null;
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }
    stopPolling();
    setVibers([]);
  }

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ vibers, connectToStream, disconnect, setVibers }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
