import React, { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext'; 
import axios from 'axios';

export default function VibersPopup({ onClose, streamId }) {
  const { vibers, setVibers } = useWebSocket();

  useEffect(() => {
    if (!streamId) return;

    async function fetchVibers() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/stream/${streamId}`);
        const participants = res.data.participants || [];
        setVibers(participants);
      } catch (err) {
        console.error('Failed to load vibers', err);
      }
    }

    fetchVibers();
  }, [streamId]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-2">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-50 w-56 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-3 mt-16 ml-2 animate-slideInSmall">
        <h3 className="text-base font-semibold mb-3 text-black dark:text-white">Vibers</h3>
        <ul className="space-y-2">
          {vibers.length === 0 ? (
            <li className="text-sm text-gray-400">No one joined yet</li>
          ) : (
            vibers.map((viber) => (
              <li key={viber.user_id} className="flex items-center space-x-3">
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

      <style jsx>{`
        @keyframes slideInSmall {
          0% { transform: translateX(-15px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInSmall { animation: slideInSmall 0.25s ease-out; }
      `}</style>
    </div>
  );
}
