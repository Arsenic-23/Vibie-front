import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active, color = 'blue' }) {
  const numLines = 10;
  const lines = Array.from({ length: numLines });

  const burstColor = color === 'red' ? '#EF4444' : '#3B82F6';

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Burst Lines */}
      <AnimatePresence>
        {active &&
          lines.map((_, i) => {
            const angle = (360 / numLines) * i;
            return (
              <motion.span
                key={i}
                initial={{
                  opacity: 1,
                  scaleY: 0,
                  rotate: angle,
                  x: '-50%',
                  y: '-100%',
                }}
                animate={{
                  scaleY: [0, 1.2, 0],
                  opacity: [1, 1, 0],
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut',
                    delay: 0.01 * i,
                  },
                }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 w-[2px] h-3 origin-bottom"
                style={{ backgroundColor: burstColor }}
              />
            );
          })}
      </AnimatePresence>

      {/* Main Icon with Pop Animation */}
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