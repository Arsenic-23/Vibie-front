import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const burstVariants = {
  initial: (i) => ({
    opacity: 1,
    scale: 0,
    rotate: i * (360 / 6),
    x: 0,
    y: 0,
  }),
  animate: (i, color) => ({
    scale: [0, 1.5, 0.8],
    x: Math.cos((i * Math.PI) / 3) * 24,
    y: Math.sin((i * Math.PI) / 3) * 24,
    opacity: [1, 1, 0],
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export function AnimatedThumb({ children, active, color = 'blue' }) {
  const bursts = Array.from({ length: 6 });

  return (
    <div className="relative inline-block">
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.3, 1] : 1,
          rotate: active ? [0, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {active &&
          bursts.map((_, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="initial"
              animate="animate"
              variants={burstVariants}
              className="absolute left-1/2 top-1/2 w-1 h-4 rounded-sm"
              style={{
                backgroundColor: color === 'red' ? '#EF4444' : '#3B82F6',
                transformOrigin: 'center',
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}