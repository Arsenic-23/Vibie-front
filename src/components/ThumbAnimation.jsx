import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, trigger }) {
  const [burst, setBurst] = useState(false);
  const numLines = 10;

  useEffect(() => {
    if (trigger) {
      triggerVibration();
      setBurst(true);
      const timer = setTimeout(() => setBurst(false), 400);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const triggerVibration = () => {
    if (navigator.vibrate) navigator.vibrate(60);
  };

  const colors = ['#ef4444', '#ec4899']; // red, pink alternating

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Burst lines */}
      <AnimatePresence>
        {burst &&
          Array.from({ length: numLines }).map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = i % 2 === 0 ? 22 : 16; // red longer, pink shorter

            return (
              <motion.span
                key={i}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{
                  scale: 1,
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeOut',
                  delay: i * 0.01,
                }}
                className="absolute w-0.5 h-2 rounded-full"
                style={{
                  backgroundColor: colors[i % 2],
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  rotate: `${angle}deg`,
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Icon bounce */}
      <motion.div
        initial={false}
        animate={{
          scale: trigger ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}