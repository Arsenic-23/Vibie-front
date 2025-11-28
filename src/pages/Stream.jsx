import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Radio, Lock, Zap, ArrowRight, Hash } from "lucide-react";
import { getFirebaseToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Button({ children, onClick, disabled, className = "", style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 font-medium transition-all focus:outline-none ${className}`}
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
      style={{
        borderRadius: "0.5rem",
        color: "white",
        ...style,
      }}
    />
  );
}

export function StreamChoice() {
  const [streamCode, setStreamCode] = useState("");
  const [focusedInput, setFocusedInput] = useState(false);

  const navigate = useNavigate();

  // ---------------------------------------------------------
  // 🔥 CREATE STREAM — Uses Firebase ID Token
  // ---------------------------------------------------------
  const handleCreateStream = async () => {
    try {
      const token = await getFirebaseToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/stream/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // IMPORTANT
        },
        body: JSON.stringify({
          title: "New Stream",
          visibility: "public",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create stream");

      localStorage.setItem("stream_id", data.stream_id);
      navigate("/home");
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  // ---------------------------------------------------------
  // 🔥 JOIN STREAM — Uses Firebase ID Token
  // ---------------------------------------------------------
  const handleJoinStream = async () => {
    try {
      const token = await getFirebaseToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/stream/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // IMPORTANT
        },
        body: JSON.stringify({
          stream_id: streamCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to join stream");

      localStorage.setItem("stream_id", streamCode.trim());
      navigate("/home");
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div className="relative size-full overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center max-w-2xl"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-8">
            Welcome to Vibie
          </p>
          <h1
            className="mb-7"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              lineHeight: "1.05",
              letterSpacing: "-0.04em",
              fontWeight: "700",
              background: "linear-gradient(to bottom, #ffffff 30%, #52525b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Choose Your Session
          </h1>
          <p className="text-base text-zinc-500 leading-relaxed">
            Create a new stream or join an existing session with friends
          </p>
        </motion.div>

        {/* Cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <CreateStreamCard onClick={handleCreateStream} />
          <JoinStreamCard
            streamCode={streamCode}
            setStreamCode={setStreamCode}
            focusedInput={focusedInput}
            setFocusedInput={setFocusedInput}
            onJoin={handleJoinStream}
          />
        </div>

        {/* Feature Pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FeaturePill icon={<Radio className="w-4 h-4" />} text="Real-time Sync" />
          <FeaturePill icon={<Lock className="w-4 h-4" />} text="Private Sessions" />
          <FeaturePill icon={<Zap className="w-4 h-4" />} text="Instant Reactions" />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------
   Create Stream Card
------------------------- */
function CreateStreamCard({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      <div
        className="relative rounded-[2rem] p-10 md:p-12 overflow-hidden transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: isHovered
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="relative space-y-8">
          <div className="inline-flex">
            <div
              className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
              }}
            >
              <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-white tracking-tight">Create Stream</h2>
              {isHovered && <ArrowRight className="w-5 h-5 text-zinc-500" />}
            </div>

            <p className="text-zinc-500 leading-relaxed">
              Start a new music session with full control over playback and invite unlimited friends.
            </p>
          </div>

          <div className="flex gap-2.5">
            <Tag color="#a855f7" text="Instant Setup" />
            <Tag color="#ec4899" text="Full Control" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------
   Join Stream Card
------------------------- */
function JoinStreamCard({
  streamCode,
  setStreamCode,
  focusedInput,
  setFocusedInput,
  onJoin,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div
        className="relative rounded-[2rem] p-10 md:p-12 overflow-hidden h-full transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: isHovered
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="relative space-y-8 h-full flex flex-col">
          <div className="inline-flex">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              }}
            >
              <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <h2 className="text-white tracking-tight">Join Stream</h2>
            <p className="text-zinc-500 leading-relaxed mt-2">
              Enter a stream code to join your friend’s session.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-end space-y-4">
            <Input
              type="text"
              placeholder="Enter stream code"
              value={streamCode}
              onChange={(e) => setStreamCode(e.target.value.toUpperCase())}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              onKeyDown={(e) => e.key === "Enter" && streamCode.trim() && onJoin()}
              className="h-14 pl-14 bg-white/5 border border-white/10"
            />

            <Button
              onClick={onJoin}
              disabled={!streamCode.trim()}
              className="w-full h-14 text-white rounded-[1.25rem]"
              style={{
                background: streamCode.trim()
                  ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                  : "rgba(255, 255, 255, 0.04)",
              }}
            >
              Join Session <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------
   UI Helpers
------------------------- */
function FeaturePill({ icon, text }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="text-zinc-600">{icon}</div>
      <span className="text-sm text-zinc-600">{text}</span>
    </div>
  );
}

function Tag({ color, text }) {
  return (
    <span
      className="px-3.5 py-2 rounded-full text-xs tracking-wide"
      style={{
        background: `${color}14`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {text}
    </span>
  );
}
