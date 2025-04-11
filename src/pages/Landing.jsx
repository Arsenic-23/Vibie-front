import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Thumbnail images (replace with your actual song thumbnails if needed)
const thumbnails = [
  'https://via.placeholder.com/80?text=Vibe',
  'https://via.placeholder.com/80?text=Drop',
  'https://via.placeholder.com/80?text=Beat',
  'https://via.placeholder.com/80?text=Tune',
  'https://via.placeholder.com/80?text=Bass',
  'https://via.placeholder.com/80?text=Flow',
];

const generateThumbnail = () => {
  const size = Math.random() * 40 + 40;
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const endX = Math.random() * window.innerWidth;
  const endY = Math.random() * window.innerHeight;

  return {
    id: Math.random().toString(36).substr(2, 9),
    src: thumbnails[Math.floor(Math.random() * thumbnails.length)],
    size,
    startX,
    startY,
    endX,
    endY,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 2,
  };
};

export default function Landing() {
  const navigate = useNavigate();
  const [floating, setFloating] = useState([]);

  const handleJoin = () => {
    window.navigator.vibrate?.(30); // Vibration
    navigate('/home');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFloating((prev) => [...prev.slice(-30), generateThumbnail()]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1f005c] via-[#5b0060] to-[#870160] text-white text-center px-4 overflow-hidden relative">

      {/* Floating thumbnails */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {floating.map((item) => (
          <motion.img
            key={item.id}
            src={item.src}
            initial={{
              x: item.startX,
              y: item.startY,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: item.endX,
              y: item.endY,
              opacity: [0, 0.9, 0],
              scale: [0.6, 1.1, 0.6],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: item.size,
              height: item.size,
              borderRadius: '12px',
              pointerEvents: 'none',
              zIndex: -1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>

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

      {/* Join the Vibe button with neon glow and depth */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{
          scale: 1.07,
          rotate: ['0deg', '1deg', '-1deg', '0deg'],
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
        }}
        onClick={handleJoin}
        className="bg-white text-purple-700 font-bold px-10 py-4 rounded-full text-lg tracking-wide border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-white/40 transition-all duration-300 relative"
      >
        <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text">
          Join the Vibe
        </span>
      </motion.button>

      {/* Background animated blobs */}
      <motion.div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -top-32 -left-20" />
      <motion.div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-32 -right-20" />
      <motion.div className="absolute w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 left-1/2 -translate-x-1/2" />
    </div>
  );
}