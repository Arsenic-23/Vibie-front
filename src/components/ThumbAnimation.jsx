import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const numRays = 12;

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
      navigator.vibrate(50);
    }
  };

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Burst Animation */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numRays }).map((_, i) => {
            const angle = (360 / numRays) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 24;
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;

            return (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scaleY: 0.5,
                  scaleX: 0.5,
                  opacity: 1,
                }}
                animate={{
                  x,
                  y,
                  scaleY: [0.5, 1.4, 0.4],
                  scaleX: [0.5, 0.7, 0.5],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: i * 0.015,
                }}
                className="absolute w-[3px] h-[3px] rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? '#f43f5e' : '#ec4899',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Thumb Icon Animation */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.15, 1] : 1,
          scaleY: active ? [1, 1.35, 1] : 1,
          rotate: active ? [0, -15, 15, 0] : 0,
          y: active ? [-2, -5, 0] : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}