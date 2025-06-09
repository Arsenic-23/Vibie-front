import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const numLines = 10;
  const colors = ['#ef4444', '#ec4899']; // red & pink burst colors

  useEffect(() => {
    if (active) {
      setShowBurst(true);
      const timer = setTimeout(() => setShowBurst(false), 500); // hide after animation
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Burst Lines */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numLines }).map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 16;

            return (
              <motion.span
                key={i}
                initial={{
                  scaleY: 0.3,
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scaleY: [0.3, 1, 0.3],
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.45,
                  ease: 'easeInOut',
                  delay: i * 0.01,
                }}
                className="absolute w-0.5 h-2 rounded-full"
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

      {/* Icon Pop */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}