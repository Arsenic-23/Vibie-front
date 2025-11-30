import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Radio, Lock, Zap, ArrowRight } from "lucide-react";
import { getFirebaseToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

/* -------------------------------------------------------------
   Reusable UI Components
------------------------------------------------------------- */
function Button({ children, onClick, disabled, className = "", style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 font-medium transition-all ${className}`}
      style={{
        padding: "0.75rem 1.5rem",
        borderRadius: "0.75rem",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Input({ className = "", style = {}, ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-transparent text-sm outline-none ${className}`}
      style={{ borderRadius: "0.5rem", color: "white", ...style }}
    />
  );
}

/* -------------------------------------------------------------
   MAIN STREAM PAGE
------------------------------------------------------------- */
export default function StreamChoice() {
  const [streamCode, setStreamCode] = useState("");
  const [showCreatedModal, setShowCreatedModal] = useState(false);
  const [createdStreamID, setCreatedStreamID] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

      setCreatedStreamID(data.stream_id);
      setShowCreatedModal(true); // SHOW POPUP
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------
     JOIN STREAM
  ------------------------------------------------------------- */
  const handleJoinStream = async (codeToJoin = null) => {
    try {
      const code = (codeToJoin ?? streamCode).trim();
      if (!code) return;
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
      if (!res.ok) throw new Error(data.detail || "Failed to join stream.");

      localStorage.setItem("stream_id", code);

      navigate("/home"); // <=== navigate to home
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
      setShowCreatedModal(false);
    }
  };

  /* -------------------------------------------------------------
     UI
  ------------------------------------------------------------- */
  return (
    <div className="relative size-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />

      {/* STREAM CREATED MODAL */}
      {showCreatedModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/20 p-8 rounded-2xl text-center w-[90%] max-w-md">
            <h1 className="text-white text-2xl font-semibold mb-4">
              Stream Created
            </h1>

            <p className="text-zinc-400 mb-6">Your stream code:</p>

            <div className="text-4xl font-bold text-white tracking-widest mb-8">
              {createdStreamID}
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
              onClick={() => handleJoinStream(createdStreamID)}
            >
              Join My Stream
            </Button>

            <Button
              className="w-full h-12 mt-3 bg-white/10 text-white"
              onClick={() => setShowCreatedModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-8">
            Welcome to Vibie
          </p>

          <h1 className="mb-7 text-white text-5xl font-bold">Choose Your Session</h1>

          <p className="text-zinc-500">Create a new stream or join an existing one</p>
        </motion.div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <CreateStreamCard onClick={handleCreateStream} disabled={loading} />

          <JoinStreamCard
            streamCode={streamCode}
            setStreamCode={setStreamCode}
            onJoin={() => handleJoinStream()}
            disabled={loading}
          />
        </div>

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
   CARDS
------------------------------------------------------------- */
function CreateStreamCard({ onClick, disabled }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div
        className="rounded-[2rem] p-10 bg-white/5 border border-white/10 cursor-pointer"
        onClick={!disabled ? onClick : undefined}
      >
        <div className="flex flex-col gap-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
            <Plus className="text-white w-8 h-8" />
          </div>

          <h2 className="text-white text-xl">Create Stream</h2>
          <p className="text-zinc-500">Start a new music session with full control.</p>
        </div>
      </div>
    </motion.div>
  );
}

function JoinStreamCard({
  streamCode,
  setStreamCode,
  onJoin,
  disabled,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-[2rem] p-10 bg-white/5 border border-white/10">
        <h2 className="text-white text-xl mb-3">Join Stream</h2>

        <Input
          type="text"
          placeholder="Enter stream code"
          value={streamCode}
          onChange={(e) => setStreamCode(e.target.value)}   // NO auto uppercase
          onKeyDown={(e) => e.key === "Enter" && streamCode.trim() && onJoin()}
          className="h-14 bg-white/10 border border-white/20"
        />

        <Button
          onClick={onJoin}
          disabled={!streamCode.trim() || disabled}
          className="w-full h-14 mt-5 text-white bg-gradient-to-br from-blue-500 to-cyan-500"
        >
          Join Session <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------
   UI Helpers
------------------------------------------------------------- */
function FeaturePill({ icon, text }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10">
      <div>{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
