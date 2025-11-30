// src/components/VibersPopup.jsx
import React, { useEffect, useState } from "react";
import { useRealtime } from "../context/RealtimeContext";

export default function VibersPopup({ onClose, streamId }) {
  const { vibers, connectToStream, disconnect } = useRealtime();
  const [participants, setParticipants] = useState([]);

  // Normalize vibers coming from Realtime WS or Poll fallback
  function normalize(list) {
    return (list || []).map((v) => ({
      user_id: v.user_id,
      name: v.name,
      username: v.username,
      profile_pic: v.profile_pic,
      is_admin: v.is_admin || false,
    }));
  }

  // Sync popup state with realtime vibers
  useEffect(() => {
    setParticipants(normalize(vibers));
  }, [vibers]);

  // Connect to stream on open
  useEffect(() => {
    const id = streamId || localStorage.getItem("stream_id");
    if (!id) return;

    connectToStream(id);

    return () => {
      disconnect();
    };
  }, [streamId]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-2 select-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-50 w-72 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-3 mt-16 ml-2 animate-slideInSmall">
        <h3 className="text-base font-semibold mb-3 text-black dark:text-white">
          Vibers
        </h3>

        <ul className="space-y-2 max-h-72 overflow-auto">
          {participants.length === 0 ? (
            <li className="text-sm text-gray-400">No one joined yet</li>
          ) : (
            participants.map((v) => (
              <li
                key={v.user_id}
                className="flex items-center space-x-3"
              >
                <img
                  src={v.profile_pic || "https://placehold.co/80x80"}
                  alt={v.name}
                  className="w-10 h-10 rounded-full border border-white dark:border-gray-700 shadow-sm object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black dark:text-white">
                    {v.name || "Unknown"}
                  </span>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {v.username ? `@${v.username}` : ""}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

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
