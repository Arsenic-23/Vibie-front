import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

const WebSocketContext = createContext();
export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const streamId = localStorage.getItem('stream_id');
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    if (!streamId || !user?.telegram_id) return;

    const wsUrl = `wss://backendvibie.onrender.com/ws/stream/${streamId}?user_id=${user.telegram_id}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[🔌 WebSocket] Connected');
      socket.send(
        JSON.stringify({
          type: 'join',
          user_id: user.telegram_id,
          name: user.name,
          profile_pic: user.profile_pic || '',
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'sync') {
        setVibers(data.vibers || []);
        setNowPlaying(data.now_playing || null);
      }
    };

    socket.onclose = () => {
      console.log('[🔌 WebSocket] Disconnected');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'leave', user_id: user.telegram_id }));
      }
      socket.close();
    };
  }, []); // only on mount

  return (
    <WebSocketContext.Provider value={{ vibers, nowPlaying }}>
      {children}
    </WebSocketContext.Provider>
  );
}