import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

const WebSocketContext = createContext();
export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children, streamId }) {
  const [vibers, setVibers] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const finalStreamId = streamId || localStorage.getItem('stream_id');

    if (!finalStreamId || !profile?.telegram_id) {
      console.warn('Missing stream_id or profile for WebSocket connection');
      return;
    }

    const wsUrl = `wss://backendvibie.onrender.com/ws/stream/${finalStreamId}?user_id=${profile.telegram_id}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[🔌 WebSocket] Connected to stream:', finalStreamId);
      socket.send(
        JSON.stringify({
          type: 'join',
          user_id: profile.telegram_id,
          name: profile.name,
          profile_pic: profile.profile_pic || '',
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'sync') {
          setVibers(data.vibers || []);
          setNowPlaying(data.now_playing || null);
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    };

    socket.onclose = () => {
      console.log('[🔌 WebSocket] Disconnected');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'leave', user_id: profile.telegram_id }));
      }
      socket.close();
    };
  }, [streamId]);

  return (
    <WebSocketContext.Provider value={{ vibers, nowPlaying }}>
      {children}
    </WebSocketContext.Provider>
  );
}