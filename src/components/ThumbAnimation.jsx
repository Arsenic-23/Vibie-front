import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const numLines = 12;
  const colors = ['#ef4444', '#ec4899']; // Red and Pink shades
  const lines = Array.from({ length: numLines });

  return (
    <div className="relative inline-block w-fit h-fit">
      <AnimatePresence>
        {active &&
          lines.map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 24;

            return (
              <motion.span
                key={i}
                initial={{
                  scaleY: 0,
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scaleY: [0, 1.5, 0],
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: 0.01 * i,
                }}
                className="absolute w-0.5 h-3 origin-center rounded-full"
                style={{
                  rotate: `${angle}deg`,
                  backgroundColor: colors[i % colors.length],
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Icon Pop */}
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