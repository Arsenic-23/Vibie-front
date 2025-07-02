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
  const [ready, setReady] = useState(false);

  // Step 1: Ensure stream_id and profile are present before opening socket
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const streamId = localStorage.getItem('stream_id');

    if (!streamId || !profile?.telegram_id) {
      console.warn('⛔ Missing stream_id or profile, skipping WebSocket init');
      return;
    }

    setReady(true);
  }, []);

  // Step 2: When ready, establish WebSocket connection
  useEffect(() => {
    if (!ready) return;

    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    const streamId = localStorage.getItem('stream_id');

    const wsUrl = `wss://backendvibie.onrender.com/ws/stream/${streamId}?user_id=${profile.telegram_id}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[🔌 WebSocket] Connected to stream:', streamId);
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
        console.error('❌ WebSocket message parsing error:', err);
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
  }, [ready]);

  return (
    <WebSocketContext.Provider value={{ vibers, nowPlaying }}>
      {children}
    </WebSocketContext.Provider>
  );
}