import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const numLines = 10;
  const colors = ['#ef4444', '#ec4899']; // red & pink

  useEffect(() => {
    if (active) {
      setShowBurst(true);
      const timer = setTimeout(() => setShowBurst(false), 400); // short and clean
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Radiating lines */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numLines }).map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 14;

            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeOut',
                  delay: 0.005 * i,
                }}
                className="absolute w-1 h-2.5 rounded-full"
                style={{
                  backgroundColor: colors[i % colors.length],
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  rotate: `${angle}deg`,
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Icon with small scale feedback */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}