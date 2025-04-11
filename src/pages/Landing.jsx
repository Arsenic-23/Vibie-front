import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const thumbnails = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
];

const generateSlide = () => ({
  id: Math.random().toString(36).substring(7),
  src: thumbnails[Math.floor(Math.random() * thumbnails.length)],
  left: Math.random() * window.innerWidth,
  delay: Math.random() * 2,
});

export default function Landing() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlides((prev) => [...prev.slice(-10), generateSlide()]);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = () => {
    window.navigator.vibrate?.(30);
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 bg-black overflow-hidden">
      
      {/* Blurry glass effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      {/* Cinematic Thumbnails */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((item, i) => (
          <motion.img
            key={item.id}
            src={item.src}
            initial={{ x: -500, y: 0, opacity: 0 }}
            animate={{
              x: [ -500, 0, 200, 500 ],
              opacity: [0, 1, 1, 0],
              scale: [0.9, 1.1, 1],
              zIndex: i + 1,
            }}
            transition={{
              duration: 6,
              ease: [0.2, 1, 0.2, 1],
              delay: item.delay,
            }}
            className="absolute w-[220px] h-[220px] rounded-2xl shadow-xl opacity-70"
            style={{ top: `${100 + (i % 5) * 60}px`, left: `${item.left}px` }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="text-6xl sm:text-7xl font-extrabold tracking-wider mb-6 font-['Poppins'] drop-shadow-2xl text-white z-10"
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
        className="text-lg font-light mb-10 max-w-md text-white/80 z-10"
      >
        Stream music together in real-time. Feel the vibe.
      </motion.p>

      {/* Join Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{
          scale: 1.08,
          rotate: ['0deg', '1deg', '-1deg', '0deg'],
          boxShadow: '0 0 35px rgba(255, 255, 255, 0.5)',
        }}
        onClick={handleJoin}
        className="bg-white text-purple-700 font-bold px-10 py-4 rounded-full text-lg tracking-wide border border-white/30 shadow-lg transition-all duration-300 z-10"
      >
        <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text">
          Join the Vibe
        </span>
      </motion.button>
    </div>
  );
}