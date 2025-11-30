import React, { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

export default function VibersPopup({ onClose, streamId }) {
  const { vibers, connectToStream, disconnect } = useWebSocket();

  useEffect(() => {
    const id = streamId || localStorage.getItem('stream_id');
    if (!id) return;
    connectToStream(id);
    return () => disconnect();
  }, [streamId]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-2">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-50 w-64 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-3 mt-16 ml-2 animate-slideInSmall">
        <h3 className="text-base font-semibold mb-3 text-black dark:text-white">Vibers</h3>
        <ul className="space-y-2 max-h-72 overflow-auto">
          {vibers.length === 0 ? (
            <li className="text-sm text-gray-400">No one joined yet</li>
          ) : (
            vibers.map((viber) => (
              <li key={viber.user_id} className="flex items-center space-x-3">
                <img src={viber.profile_pic || 'https://placehold.co/80x80'} alt={viber.name}
                     className="w-8 h-8 rounded-full border border-white dark:border-gray-700 shadow-sm" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black dark:text-white">{viber.name || 'Unknown'}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{viber.username ? `@${viber.username}` : ''}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <style jsx>{`@keyframes slideInSmall{0%{transform:translateX(-15px);opacity:0}100%{transform:translateX(0);opacity:1}}.animate-slideInSmall{animation:slideInSmall 0.25s ease-out}`}</style>
    </div>
  );
}

