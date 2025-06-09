import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const numLines = 12;
  const colors = ['#ef4444', '#ec4899']; // red/pink combo

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
      navigator.vibrate(10); // light tap vibration like iOS
    }
  };

  return (
    <div className="relative inline-block w-fit h-fit">
      {/* Radiating Lines */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numLines }).map((_, i) => {
            const angle = (360 / numLines) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 18;

            return (
              <motion.span
                key={i}
                initial={{
                  scale: 0.3,
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  scale: [0.3, 1, 0.3],
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

      {/* Icon bounce on tap */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}