import React from 'react';
import { motion } from 'framer-motion';

export default function VoiceVisualizer({ isListening }) {
  const bars = [1, 2, 3, 4, 5];

  return (
    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex items-end gap-[2px] h-4">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-[2px] rounded-sm bg-purple-500"
          animate={isListening ? { height: ['20%', '100%', '20%'] } : { height: '20%' }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'loop',
            delay: bar * 0.1,
          }}
        />
      ))}
    </div>
  );
}