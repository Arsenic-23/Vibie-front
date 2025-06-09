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
            const isPink = i % 2 !== 0;
            const color = isPink ? '#ec4899' : '#f43f5e';
            const lineLength = isPink ? 12 : 18;

            return (
              <motion.div
                key={i}
                initial={{
                  scaleY: 0,
                  opacity: 1,
                }}
                animate={{
                  scaleY: [0, 1, 0.2],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: i * 0.01,
                }}
                className="absolute w-[2px] rounded-full"
                style={{
                  height: `${lineLength}px`,
                  backgroundColor: color,
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateY(-50%)`,
                  transformOrigin: 'center bottom',
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