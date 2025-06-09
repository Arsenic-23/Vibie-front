
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
      {/* Radial Burst Animation */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numRays }).map((_, i) => {
            const angle = (360 / numRays) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 24;
            const isPink = i % 2 !== 0;
            const finalX = Math.cos(rad) * distance;
            const finalY = Math.sin(rad) * distance;
            const lineLength = isPink ? 5 : 8;

            return (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  width: 2,
                  height: 2,
                  opacity: 1,
                }}
                animate={{
                  x: finalX,
                  y: finalY,
                  width: [2, 2, 2],
                  height: [2, lineLength, 2],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: i * 0.015,
                }}
                className="absolute rounded-full origin-center"
                style={{
                  backgroundColor: isPink ? '#ec4899' : '#f43f5e',
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