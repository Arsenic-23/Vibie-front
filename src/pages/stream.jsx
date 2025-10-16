import { motion } from 'motion/react';
import { Plus, Users, Radio, Lock, Zap, ArrowRight, Hash } from 'lucide-react';
import { useState } from 'react';

function Button({ children, onClick, disabled, className = '', style = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 font-medium transition-all focus:outline-none ${className}`}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '0.75rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  onFocus,
  onBlur,
  onKeyDown,
  className = '',
  style = {},
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={`w-full px-4 py-3 bg-transparent text-sm outline-none ${className}`}
      style={{
        borderRadius: '0.5rem',
        color: 'white',
        ...style,
      }}
    />
  );
}

export function StreamChoice({ onJoinStream }) {
  const [streamCode, setStreamCode] = useState('');
  const [focusedInput, setFocusedInput] = useState(false);

  return (
    <div className="relative size-full overflow-hidden bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 md:mb-28 text-center max-w-2xl"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-8">Welcome to Vibie</p>
          <h1
            className="mb-7"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.04em',
              fontWeight: '700',
              background: 'linear-gradient(to bottom, #ffffff 30%, #52525b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choose Your Session
          </h1>
          <p className="text-base text-zinc-500 leading-relaxed">
            Create a new stream or join an existing session with friends
          </p>
        </motion.div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <CreateStreamCard onJoinStream={onJoinStream} />
          <JoinStreamCard
            streamCode={streamCode}
            setStreamCode={setStreamCode}
            focusedInput={focusedInput}
            setFocusedInput={setFocusedInput}
            onJoinStream={onJoinStream}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <FeaturePill icon={<Radio className="w-4 h-4" />} text="Real-time Sync" />
          <FeaturePill icon={<Lock className="w-4 h-4" />} text="Private Sessions" />
          <FeaturePill icon={<Zap className="w-4 h-4" />} text="Instant Reactions" />
        </motion.div>
      </div>
    </div>
  );
}

function CreateStreamCard({ onJoinStream }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onJoinStream}
      className="relative group cursor-pointer"
    >
      <div
        className="relative rounded-[2rem] p-10 md:p-12 overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: isHovered
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="relative space-y-8">
          <div className="inline-flex">
            <div
              className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              }}
            >
              <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-white tracking-tight">Create Stream</h2>
              <div style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>
                <ArrowRight className="w-5 h-5 text-zinc-500" />
              </div>
            </div>
            <p className="text-zinc-500 leading-relaxed">
              Start a new music session with full control over playback and invite unlimited friends to join
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Tag color="#a855f7" text="Instant Setup" />
            <Tag color="#ec4899" text="Full Control" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <div
            style={{
              background: 'radial-gradient(circle at top right, rgba(168, 85, 247, 1), transparent 60%)',
            }}
            className="absolute inset-0"
          />
        </div>
      </div>
    </motion.div>
  );
}

function JoinStreamCard({ streamCode, setStreamCode, focusedInput, setFocusedInput, onJoinStream }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div
        className="relative rounded-[2rem] p-10 md:p-12 overflow-hidden h-full transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: isHovered
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="relative space-y-8 h-full flex flex-col">
          <div className="inline-flex">
            <div
              className="w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              }}
            >
              <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-white tracking-tight">Join Stream</h2>
            <p className="text-zinc-500 leading-relaxed">
              Enter a stream code to connect and listen together with your friends in real-time
            </p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-end">
            <div className="relative">
              <div className="relative flex items-center">
                <div className="absolute left-5 pointer-events-none">
                  <Hash className="w-5 h-5 text-zinc-600" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter stream code"
                  value={streamCode}
                  onChange={(e) => setStreamCode(e.target.value.toUpperCase())}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && streamCode.trim()) {
                      onJoinStream();
                    }
                  }}
                  className="h-14 rounded-[1.25rem] pl-14 pr-5 border-0 text-white placeholder:text-zinc-600 transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: focusedInput
                      ? '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                />
              </div>
            </div>

            <Button
              onClick={onJoinStream}
              disabled={!streamCode.trim()}
              className="w-full h-14 rounded-[1.25rem] relative overflow-hidden disabled:opacity-30 transition-all duration-200"
              style={{
                background: streamCode.trim()
                  ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                  : 'rgba(255, 255, 255, 0.04)',
              }}
            >
              <span className="text-white flex items-center justify-center gap-2">
                Join Session <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <p className="text-xs text-zinc-600 text-center pt-1">
              Ask your friend for their stream code
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5 pointer-events-none">
          <div
            style={{
              background: 'radial-gradient(circle at bottom left, rgba(59, 130, 246, 1), transparent 60%)',
            }}
            className="absolute inset-0"
          />
        </div>
      </div>
    </motion.div>
  );
}

function FeaturePill({ icon, text }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
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
