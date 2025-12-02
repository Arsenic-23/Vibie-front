// src/context/RealtimeContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getFirebaseToken } from "../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;
const WS_PATH = "/realtime/stream";

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

const RealtimeContext = createContext({
  vibers: [],
  connectToStream: async () => {},
  disconnect: () => {},
  sendProfileUpdate: async () => {},
  nowPlaying: null,
  queue: [],
});

export function RealtimeProvider({ children }) {
  const [vibers, setVibers] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [queue, setQueue] = useState([]);

  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const backoffRef = useRef(RECONNECT_BASE_MS);
  const shouldReconnectRef = useRef(true);
  const pingTimerRef = useRef(null);

  // -------------------------
  // WebSocket URL builder
  // -------------------------
  async function buildWsUrl(streamId) {
    const token = await getFirebaseToken().catch(() => null);

    let url = API.replace(/^http/, "ws");
    url += `${WS_PATH}/${streamId}`;

    if (token) {
      return `${url}?token=${encodeURIComponent(token)}`;
    }

    const profile = JSON.parse(localStorage.getItem("profile") || "null");
    if (profile?.uid) {
      return `${url}?user_id=${encodeURIComponent(profile.uid)}`;
    }

    return url;
  }

  // -------------------------
  // Normalize participants
  // -------------------------
  function normalizeParticipants(list = []) {
    return list.map((v) => ({
      user_id: v.user_id,
      name: v.name,
      username: v.username,
      profile_pic: v.profile_pic,
      is_admin: !!v.is_admin,
      joined_at: v.joined_at || null,
      last_seen_at: v.last_seen_at || null,
    }));
  }

  // -------------------------
  // Message handler
  // -------------------------
  function handleMessage(payload) {
    const type = payload.type;

    if (type === "full_state") {
      setVibers(normalizeParticipants(payload.participants || []));
      if (payload.now_playing !== undefined) {
        setNowPlaying(payload.now_playing);
      }
      if (payload.queue !== undefined) {
        setQueue(payload.queue || []);
      }
    } else if (type === "join") {
      const p = normalizeParticipants([payload.participant])[0];
      setVibers((prev) => {
        if (!p) return prev;
        const exists = prev.some((x) => x.user_id === p.user_id);
        if (exists) {
          return prev.map((x) => (x.user_id === p.user_id ? p : x));
        }
        return [p, ...prev];
      });
    } else if (type === "leave") {
      setVibers((prev) => prev.filter((p) => p.user_id !== payload.user_id));
    } else if (type === "update") {
      const u = normalizeParticipants([payload.user])[0];
      if (!u) return;
      setVibers((prev) =>
        prev.map((p) => (p.user_id === u.user_id ? { ...p, ...u } : p))
      );
    } else if (type === "queue") {
      setQueue(payload.queue || []);
    }
  }

  // -------------------------
  // Open WebSocket for a given streamId
  // -------------------------
  async function openWebSocket(streamId) {
    if (!streamId) return;

    const url = await buildWsUrl(streamId);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        backoffRef.current = RECONNECT_BASE_MS;

        // ask for current state immediately
        ws.send(JSON.stringify({ type: "request_full_state" }));

        // send profile once if we have it
        const local = JSON.parse(localStorage.getItem("profile") || "null");
        if (local) {
          ws.send(
            JSON.stringify({
              type: "update_profile",
              profile: {
                name: local.name,
                profile_pic: local.photo,
                username: local.username,
              },
            })
          );
        }

        // start ping to keep connection alive
        if (pingTimerRef.current) {
          clearInterval(pingTimerRef.current);
        }
        pingTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25000);
      };

      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          handleMessage(payload);
        } catch {
          // ignore malformed payloads
        }
      };

      ws.onerror = () => {
        try {
          ws.close();
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        if (pingTimerRef.current) {
          clearInterval(pingTimerRef.current);
          pingTimerRef.current = null;
        }

        // if we changed stream or explicitly disconnected, do not reconnect
        if (!shouldReconnectRef.current) {
          return;
        }

        // reconnect only if this close belongs to current stream
        if (streamRef.current === streamId) {
          const delay = backoffRef.current;
          backoffRef.current = Math.min(
            backoffRef.current * 1.8,
            RECONNECT_MAX_MS
          );
          setTimeout(() => {
            // still same stream and still want reconnection
            if (shouldReconnectRef.current && streamRef.current === streamId) {
              openWebSocket(streamId);
            }
          }, delay);
        }
      };
    } catch (e) {
      console.warn("WebSocket connect failed:", e);
    }
  }

  // -------------------------
  // Public API
  // -------------------------
  async function connectToStream(streamId) {
    if (!streamId) return;

    // same stream and ws is open: nothing to do
    if (
      streamRef.current === streamId &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      return;
    }

    // switch to new stream
    streamRef.current = streamId;
    shouldReconnectRef.current = true;

    // close previous socket if any
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    await openWebSocket(streamId);
  }

  function disconnect() {
    shouldReconnectRef.current = false;

    if (pingTimerRef.current) {
      clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    streamRef.current = null;
    setVibers([]);
    setNowPlaying(null);
    setQueue([]);
  }

  // -------------------------
  // Auto cleanup on unmount / page unload
  // -------------------------
  useEffect(() => {
    function handleUnload() {
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // Profile update API
  // -------------------------
  async function sendProfileUpdate(profile) {
    const ws = wsRef.current;

    // prefer WebSocket update
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "update_profile", profile }));
      return;
    }

    // fallback to HTTP if needed
    try {
      const token = await getFirebaseToken();
      await fetch(`${API}/user/update_profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.warn("profile update fallback failed", e);
    }
  }

  return (
    <RealtimeContext.Provider
      value={{
        vibers,
        connectToStream,
        disconnect,
        sendProfileUpdate,
        nowPlaying,
        queue,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
// src/components/VibersPopup.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useRealtime } from "../context/RealtimeContext";
import { getFirebaseToken } from "../utils/auth";

export default function VibersPopup({ onClose, streamId }) {
  const { vibers, connectToStream } = useRealtime();
  const [participants, setParticipants] = useState([]);

  function normalize(list) {
    return (list || []).map((v) => ({
      user_id: v.user_id,
      name: v.name,
      username: v.username,
      profile_pic: v.profile_pic,
      is_admin: v.is_admin || false,
    }));
  }

  // 1) Initial snapshot via HTTP so popup is never blank
  useEffect(() => {
    const id = streamId || localStorage.getItem("stream_id");
    if (!id) return;

    async function load() {
      try {
        const token = await getFirebaseToken().catch(() => null);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/analytics/stream/${id}/participants`,
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {}
        );

        if (!res.ok) {
          console.warn("Failed to fetch participants", res.status);
          return;
        }

        const data = await res.json();
        if (data.participants) {
          setParticipants(normalize(data.participants));
        }
      } catch (e) {
        console.log("Failed analytics participants:", e);
      }
    }

    load();
  }, [streamId]);

  // 2) Connect to WebSocket for realtime updates
  useEffect(() => {
    const id = streamId || localStorage.getItem("stream_id");
    if (!id) return;

    connectToStream(id);
  }, [streamId, connectToStream]);

  // 3) Whenever realtime vibers has data, use that as the source of truth
  useEffect(() => {
    if (vibers && vibers.length > 0) {
      setParticipants(normalize(vibers));
    }
  }, [vibers]);

  const hasParticipants = participants && participants.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-2 select-none">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-50 w-72 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-3 mt-16 ml-2 animate-slideInSmall">
        <h3 className="text-base font-semibold mb-3 text-black dark:text-white">
          Vibers
        </h3>

        <ul className="space-y-2 max-h-72 overflow-auto">
          {!hasParticipants ? (
            <li className="text-sm text-gray-400">No one joined yet</li>
          ) : (
            participants.map((v) => (
              <li key={v.user_id} className="flex items-center space-x-3">
                <img
                  src={v.profile_pic || "https://placehold.co/80x80"}
                  alt={v.name || v.username || "Viber"}
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
