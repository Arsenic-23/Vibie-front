import React, { useEffect, useState, useRef } from 'react';

export default function VibersPopup({ onClose }) {
  const [vibers, setVibers] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const stream_id = localStorage.getItem("stream_id");
    const user_id = localStorage.getItem("user_id");

    if (!stream_id || !user_id) return;

    const ws = new WebSocket(`wss://your-backend-url/ws/stream/${stream_id}?user_id=${user_id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sync" && data.vibers) {
        setVibers(data.vibers);
      }
    };

    ws.onerror = () => {
      console.error("❌ WebSocket error");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-2">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Floating Panel */}
      <div className="relative z-50 w-56 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-3 mt-16 ml-2 animate-slideInSmall">
        <h3 className="text-base font-semibold mb-3 text-black dark:text-white">Vibers</h3>
        <ul className="space-y-2">
          {vibers.length === 0 ? (
            <li className="text-sm text-gray-400">No one joined yet</li>
          ) : (
            vibers.map((viber, index) => (
              <li key={index} className="flex items-center space-x-3">
                <img
                  src={viber.profile_pic}
                  alt={viber.name}
                  className="w-8 h-8 rounded-full border border-white dark:border-gray-700 shadow-sm"
                />
                <span className="text-sm font-medium text-black dark:text-white">
                  {viber.name}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slideInSmall {
          0% {
            transform: translateX(-15px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInSmall {
          animation: slideInSmall 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}