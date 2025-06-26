// File: app/src/contexts/WebSocketContext.jsx

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const socketRef = useRef(null);
  const stream_id = localStorage.getItem('stream_id');
  const user = JSON.parse(localStorage.getItem('profile') || '{}');

  useEffect(() => {
    if (!stream_id || !user?.telegram_id) return;

    const wsUrl = `wss://backendvibie.onrender.com/ws/${stream_id}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[🔌 WebSocket] Connected');
      socket.send(JSON.stringify({
        type: 'join',
        user_id: user.telegram_id,
        name: user.name,
        profile_pic: user.profile_pic || '',
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'vibers_update') {
        setVibers(data.vibers || []);
      } else if (data.type === 'now_playing') {
        setNowPlaying(data.song || null);
      }
    };

    socket.onclose = () => {
      console.log('[🔌 WebSocket] Disconnected');
    };

    return () => {
      socket.send(JSON.stringify({ type: 'leave', user_id: user.telegram_id }));
      socket.close();
    };
  }, [stream_id, user]);

  return (
    <WebSocketContext.Provider value={{ vibers, nowPlaying }}>
      {children}
    </WebSocketContext.Provider>
  );
}