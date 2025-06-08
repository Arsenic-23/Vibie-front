import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PlayPauseButton({ isPlaying, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-white text-black dark:bg-white dark:text-black shadow-xl flex items-center justify-center"
      whileTap={{ scale: 0.9 }}
    >
      <motion.svg
        key={isPlaying ? 'pause' : 'play'}
        width="32"
        height="32"
        viewBox="0 0 24 24"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2 }}
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isPlaying ? (
          <motion.g>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </motion.g>
        ) : (
          <motion.path d="M6 4L20 12L6 20V4Z" />
        )}
      </motion.svg>
    </motion.button>
  );
}