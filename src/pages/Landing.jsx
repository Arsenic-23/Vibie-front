import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1f005c] via-[#5b0060] to-[#870160] text-white text-center px-4 overflow-hidden relative">
      {/* Animated Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl sm:text-7xl font-extrabold tracking-wider mb-6 font-['Poppins'] drop-shadow-xl"
      >
        <motion.span
          initial={{ scale: 0.95 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
        >
          VIBIE
        </motion.span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-lg font-light mb-10 max-w-md text-white/80"
      >
        Stream music together in real-time. Feel the vibe. Live the music.
      </motion.p>

      {/* 3D Join Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{
          scale: 1.1,
          rotate: ['0deg', '1.5deg', '-1.5deg', '0deg'],
          boxShadow: '0 8px 30px rgba(255, 255, 255, 0.4)',
        }}
        onClick={handleJoin}
        className="bg-gradient-to-r from-white to-gray-200 text-purple-800 font-bold px-10 py-4 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all duration-300 text-lg tracking-wide border border-white/30 hover:shadow-white/40"
      >
        Join the Vibe
      </motion.button>

      {/* Background animated blobs */}
      <motion.div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -top-32 -left-20" />
      <motion.div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-32 -right-20" />
      <motion.div className="absolute w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 left-1/2 -translate-x-1/2" />
    </div>
  );
}