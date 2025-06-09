import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const numLines = 10;

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
      {/* Burst Lines */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numLines }).map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 20;

            return (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                animate={{
                  x: Math.cos(rad) * distance,
                  y: Math.sin(rad) * distance,
                  scale: 0.3,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.45,
                  ease: 'easeOut',
                  delay: i * 0.01,
                }}
                className="absolute w-[2px] h-[8px] rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? '#f43f5e' : '#fb7185',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Thumb Icon with scale & upward motion */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.2, 1] : 1,
          y: active ? [-2, -4, 0] : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}