import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Radio, Lock, Zap, ArrowRight } from "lucide-react";
import { getFirebaseToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

// Guaranteed API value
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function StreamChoice() {
  const [streamCode, setStreamCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  console.log("🔥 USING API:", API);

  /* -------------------------------------------------------------
      CREATE STREAM
  ------------------------------------------------------------- */
  const handleCreateStream = async () => {
    try {
      setLoading(true);

      const token = await getFirebaseToken();

      const res = await fetch(`${API}/stream/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "New Stream",
          visibility: "public",
        }),
      });

      const data = await res.json();
      console.log("CREATE RESPONSE:", data);

      if (!res.ok) throw new Error(data.detail || "Failed to create stream");

      localStorage.setItem("stream_id", data.stream_id);

      navigate("/stream/room");
    } catch (err) {
      console.error("Create Stream Error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------
      JOIN STREAM
  ------------------------------------------------------------- */
  const handleJoinStream = async () => {
    try {
      if (!streamCode.trim()) return;

      setLoading(true);

      const token = await getFirebaseToken();

      const res = await fetch(`${API}/stream/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stream_id: streamCode.trim(),
        }),
      });

      const data = await res.json();
      console.log("JOIN RESPONSE:", data);

      if (!res.ok) throw new Error(data.detail || "Failed to join stream");

      localStorage.setItem("stream_id", streamCode.trim());

      navigate("/stream/room");
    } catch (err) {
      console.error("Join Stream Error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative size-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-16">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-8">
            Welcome to Vibie
          </p>

          <h1 className="mb-7 text-white text-5xl font-bold">Choose Your Session</h1>
          <p className="text-zinc-500">Create a session or join one instantly</p>
        </motion.div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <CreateStreamCard onClick={handleCreateStream} disabled={loading} />
          <JoinStreamCard
            streamCode={streamCode}
            setStreamCode={setStreamCode}
            onJoin={handleJoinStream}
            disabled={loading}
          />
        </div>

        <div className="flex gap-4 mt-10 text-zinc-600">
          <FeaturePill icon={<Radio size={16} />} text="Real-time Sync" />
          <FeaturePill icon={<Lock size={16} />} text="Private or Public" />
          <FeaturePill icon={<Zap size={16} />} text="Instant Joining" />
        </div>

      </div>
    </div>
  );
}

function CreateStreamCard({ onClick, disabled }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div
        onClick={!disabled ? onClick : undefined}
        className="rounded-[2rem] p-10 bg-white/5 border border-white/10 cursor-pointer"
      >
        <div className="flex flex-col gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
            <Plus className="text-white w-8 h-8" />
          </div>

          <h2 className="text-white text-xl">Create Stream</h2>
          <p className="text-zinc-500">Start a fresh music session.</p>
        </div>
      </div>
    </motion.div>
  );
}

function JoinStreamCard({ streamCode, setStreamCode, onJoin, disabled }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-[2rem] p-10 bg-white/5 border border-white/10">

        <h2 className="text-white text-xl mb-3">Join Stream</h2>

        <input
          type="text"
          placeholder="Enter stream code"
          value={streamCode}
          onChange={(e) => setStreamCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && streamCode.trim() && onJoin()}
          className="w-full h-14 px-4 bg-white/10 border border-white/20 rounded-xl outline-none text-white"
        />

        <button
          onClick={onJoin}
          disabled={!streamCode.trim() || disabled}
          className="w-full h-14 mt-5 text-white bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl"
        >
          Join Session <ArrowRight className="inline ml-2 w-4 h-4" />
        </button>

      </div>
    </motion.div>
  );
}

function FeaturePill({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
      <div>{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
