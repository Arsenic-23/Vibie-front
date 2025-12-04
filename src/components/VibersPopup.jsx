// src/components/VibersPopup.jsx
import React, { useEffect, useState } from "react";
import { useRealtime } from "../context/RealtimeContext";
import { getFirebaseToken } from "../utils/auth";

export default function VibersPopup({ onClose, streamId }) {
  const { vibers } = useRealtime();
  const [initialSnapshot, setInitialSnapshot] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalize = (list) => {
    const map = new Map();
    for (const v of list || []) {
      if (!v?.user_id) continue;
      map.set(v.user_id, {
        user_id: v.user_id,
        name: v.name,
        username: v.username,
        profile_pic: v.profile_pic,
        is_admin: v.is_admin || false,
      });
    }
    return Array.from(map.values());
  };

  async function fetchSnapshot(id) {
    if (!id) return;
    setLoading(true);
    try {
      const token = await getFirebaseToken().catch(() => null);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/analytics/stream/${id}/participants`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      const data = await res.json();
      setInitialSnapshot(normalize(data.participants || []));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = streamId || localStorage.getItem("stream_id");
    if (!id) return;
    fetchSnapshot(id);
    const t = setTimeout(() => fetchSnapshot(id), 700);
    return () => clearTimeout(t);
  }, [streamId]);

  // prefer live vibers (deduped), else snapshot
  const participants = (vibers && vibers.length > 0) ? normalize(vibers) : initialSnapshot;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-2 select-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-50 w-72 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-3 mt-16 ml-2 animate-slideInSmall">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-black dark:text-white">Vibers</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const id = streamId || localStorage.getItem("stream_id");
                fetchSnapshot(id);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-700"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={onClose} className="text-xs text-zinc-400">Close</button>
          </div>
        </div>

        <ul className="space-y-2 max-h-72 overflow-auto">
          {participants.length === 0 ? (
            <li className="text-sm text-gray-400">No one joined yet</li>
          ) : (
            participants.map((v) => (
              <li key={v.user_id} className="flex items-center space-x-3">
                <img
                  src={v.profile_pic || "https://placehold.co/80x80"}
                  alt={v.name}
                  className="w-10 h-10 rounded-full object-cover border border-white dark:border-gray-700 shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{v.name || "Unknown"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {v.username ? "@" + v.username : ""}
                  </span>
                </div>
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
