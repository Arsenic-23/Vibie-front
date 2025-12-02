import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Radio, Lock, Zap, ArrowRight, Copy, Check } from "lucide-react";
import { getFirebaseToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useRealtime } from "../context/RealtimeContext";   // ✅ ADDED

const API = import.meta.env.VITE_BACKEND_URL;

/* -------------------------------------------------------------
   Reusable Components
------------------------------------------------------------- */
function Button({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        px-4 py-3 rounded-xl font-medium transition-all duration-300
        active:scale-[0.97] disabled:opacity-50
        ${className}
      `}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-3 bg-white/5 backdrop-blur-xl
        border border-white/10 text-white text-sm rounded-lg
        outline-none transition-all duration-300 
        focus:border-white/30 focus:bg-white/10
        ${className}
      `}
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
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  // ✅ ADD REALTIME CONTEXT
  const { connectToStream, disconnect } = useRealtime();

  /* -------------------------------------------------------------
     AUTO CONNECT WHEN A STREAM IS CREATED OR JOINED
  ------------------------------------------------------------- */
  useEffect(() => {
    if (createdCode) {
      connectToStream(createdCode);   // 🔥 Connect right after creation
    }
  }, [createdCode]);

  useEffect(() => {
    if (localStorage.getItem("stream_id")) {
      connectToStream(localStorage.getItem("stream_id"));  // 🔥 Auto connect
    }

    return () => disconnect(); // Clean on exit
  }, []);

  /* -------------------------------------------------------------
     COPY CODE BTN
  ------------------------------------------------------------- */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

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
      if (!res.ok) throw new Error(data.detail || "Failed to create stream.");

      setCreatedCode(data.stream_id);

      // 🔥 Connect immediately
      connectToStream(data.stream_id);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------
     JOIN STREAM
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

      // 🔥 Connect websocket instantly
      connectToStream(code);

      navigate("/home");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------
     Animations
  ------------------------------------------------------------- */
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const stagger = {
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  /* -------------------------------------------------------------
     UI
  ------------------------------------------------------------- */
  return (
    <div className="relative size-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative flex flex-col items-center justify-center min-h-full px-6 py-16"
      >
        <motion.div variants={fadeUp} className="mb-20 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-8">
            Welcome to Vibie
          </p>

          <motion.h1
            variants={fadeUp}
            className="mb-7 text-white text-5xl font-bold"
          >
            Choose Your Session
          </motion.h1>

          <p className="text-zinc-500">Create a new stream or join an existing one</p>
        </motion.div>

        {/* CARDS */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
        >
          {/* CREATE STREAM */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="rounded-[2rem] p-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
          >
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
              >
                <Plus className="text-white w-8 h-8" />
              </motion.div>

              <h2 className="text-white text-xl">Create Stream</h2>
              <p className="text-zinc-500">Start a new music session instantly.</p>

              <Button
                disabled={loading}
                onClick={handleCreateStream}
                className="bg-gradient-to-br from-purple-600 to-pink-600 text-white mt-2 shadow-lg hover:opacity-90"
              >
                {loading ? "Creating..." : "Create Stream"}
              </Button>

              {createdCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-white/10 border border-white/20 rounded-xl"
                >
                  <p className="text-zinc-400 text-sm mb-1">Your Stream Code</p>

                  <div className="flex items-center justify-between">
                    <p className="text-white text-3xl font-bold tracking-widest">
                      {createdCode}
                    </p>

                    <button
                      onClick={handleCopyCode}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                    >
                      {copied ? (
                        <Check className="text-green-400 w-5 h-5" />
                      ) : (
                        <Copy className="text-white w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <Button
                    className="mt-4 w-full bg-white/10 border border-white text-white hover:bg-white/20"
                    onClick={() => handleJoinStream(createdCode)}
                  >
                    Join This Stream
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* JOIN STREAM */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="rounded-[2rem] p-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
          >
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
              className="w-full h-14 mt-5 text-white bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
            >
              Join Session <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* FEATURES */}
        <motion.div
          variants={fadeUp}
          className="flex gap-4 mt-10 text-zinc-600"
        >
          <FeaturePill icon={<Radio size={16} />} text="Real-time Sync" />
          <FeaturePill icon={<Lock size={16} />} text="Private Sessions" />
          <FeaturePill icon={<Zap size={16} />} text="Instant Reactions" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------
   UI Helpers
------------------------------------------------------------- */
function FeaturePill({ icon, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
    >
      {icon}
      <span className="text-sm">{text}</span>
    </motion.div>
  );
}
