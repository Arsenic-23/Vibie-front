import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Radio, Lock, Zap, ArrowRight } from "lucide-react";
import { getFirebaseToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

/* -------------------------------------------------------------
   Reusable UI Components
------------------------------------------------------------- */
function Button({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`px-4 py-3 rounded-xl font-medium transition-all ${className}`}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-white/10 border border-white/20 text-white text-sm rounded-lg outline-none ${className}`}
    />
  );
}

/* -------------------------------------------------------------
   MAIN STREAM PAGE
------------------------------------------------------------- */
export default function StreamChoice() {
  const [streamCode, setStreamCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* -------------------------------------------------------------
     CREATE STREAM — FAST, DIRECT, CLEAN
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
      if (!res.ok) throw new Error(data.detail || "Failed to create stream.");

      setCreatedCode(data.stream_id);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------
     JOIN STREAM — INSTANT + SMOOTH
  ------------------------------------------------------------- */
  const handleJoinStream = async (codeArg = null) => {
    const code = (codeArg || streamCode).trim();
    if (!code) return;

    try {
      setLoading(true);

      const token = await getFirebaseToken();

      const res = await fetch(`${API}/stream/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stream_id: code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Join failed");

      localStorage.setItem("stream_id", code);

      navigate("/home");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------
     UI
  ------------------------------------------------------------- */
  return (
    <div className="relative size-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      {/* MAIN CONTENT */}
      <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-16">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-8">
            Welcome to Vibie
          </p>

          <h1 className="mb-7 text-white text-5xl font-bold">Choose Your Session</h1>

          <p className="text-zinc-500">Create a new stream or join an existing one</p>
        </motion.div>

        {/* CARDS */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

          {/* ---------------------- CREATE STREAM CARD ---------------------- */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-[2rem] p-10 bg-white/5 border border-white/10">

              <div className="flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <Plus className="text-white w-8 h-8" />
                </div>

                <h2 className="text-white text-xl">Create Stream</h2>
                <p className="text-zinc-500">Start a new music session instantly.</p>

                <Button
                  disabled={loading}
                  onClick={handleCreateStream}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 text-white mt-2"
                >
                  {loading ? "Creating..." : "Create Stream"}
                </Button>

                {createdCode && (
                  <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-xl">
                    <p className="text-zinc-400 text-sm mb-1">Your Stream Code</p>
                    <p className="text-white text-3xl font-bold tracking-widest">{createdCode}</p>

                    <Button
                      className="mt-4 w-full bg-white/10 border border-white text-white"
                      onClick={() => handleJoinStream(createdCode)}
                    >
                      Join This Stream
                    </Button>
                  </div>
                )}
              </div>

            </div>
          </motion.div>

          {/* ---------------------- JOIN STREAM CARD ---------------------- */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-[2rem] p-10 bg-white/5 border border-white/10">

              <h2 className="text-white text-xl mb-3">Join Stream</h2>

              <Input
                type="text"
                placeholder="Enter stream code"
                value={streamCode}
                onChange={(e) => setStreamCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinStream()}
              />

              <Button
                disabled={!streamCode.trim() || loading}
                onClick={() => handleJoinStream()}
                className="w-full h-14 mt-5 text-white bg-gradient-to-br from-blue-500 to-cyan-500"
              >
                Join Session <ArrowRight className="w-4 h-4" />
              </Button>

            </div>
          </motion.div>

        </div>

        {/* ---------------------- FEATURES ---------------------- */}
        <div className="flex gap-4 mt-10 text-zinc-600">
          <FeaturePill icon={<Radio size={16} />} text="Real-time Sync" />
          <FeaturePill icon={<Lock size={16} />} text="Private Sessions" />
          <FeaturePill icon={<Zap size={16} />} text="Instant Reactions" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   UI Helpers
------------------------------------------------------------- */
function FeaturePill({ icon, text }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
}
