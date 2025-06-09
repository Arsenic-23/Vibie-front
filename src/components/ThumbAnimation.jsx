import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const numLines = 12;

  useEffect(() => {
    if (active) {
      triggerVibration();
      setShowBurst(true);
      const timer = setTimeout(() => setShowBurst(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(60);
    }
  };

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Burst Animation */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numLines }).map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 20;

            return (
              <motion.div
                key={i}
                initial={{
                  scale: 0.6,
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: [0.6, 1, 0.6],
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                  delay: i * 0.01,
                }}
                className="absolute w-[2px] h-[8px] rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? '#ef4444' : '#f43f5e', // red shades
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  rotate: `${angle}deg`,
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Button Icon with scale */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.25, 1] : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}