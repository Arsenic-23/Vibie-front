import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active, color = 'red' }) {
  const numBursts = 10;
  const burstColor = color === 'blue' ? '#3B82F6' : '#EF4444'; // Use Tailwind red/blue color

  const bursts = Array.from({ length: numBursts });

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Burst Dots (circular, popping outwards) */}
      <AnimatePresence>
        {active &&
          bursts.map((_, i) => {
            const angle = (360 / numBursts) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 16; // px distance from center

            return (
              <motion.span
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: [0, 1.2, 0.8, 0],
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: [1, 1, 0.8, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 0.01 * i,
                }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: burstColor,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Like icon with pop effect */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}