import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  const [showBurst, setShowBurst] = useState(false);
  const containerRef = useRef(null);
  const numRays = 10;

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
    <div ref={containerRef} className="relative inline-block w-fit h-fit">
      {/* Rays shooting from thumb tip */}
      <AnimatePresence>
        {showBurst &&
          Array.from({ length: numRays }).map((_, i) => {
            const angle = (360 / numRays) * i;
            const rad = (angle * Math.PI) / 180;
            const distance = 28;
            const x = Math.cos(rad) * distance;
            const y = Math.sin(rad) * distance;

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scaleY: 1, opacity: 1 }}
                animate={{
                  x,
                  y,
                  scaleY: 1.8,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.45,
                  ease: 'easeOut',
                  delay: i * 0.01,
                }}
                className="absolute w-[2px] h-[10px] rounded-full"
                style={{
                  backgroundColor: '#f43f5e',
                  top: '45%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(' + angle + 'deg)',
                }}
              />
            );
          })}
      </AnimatePresence>

      {/* Thumb Icon with scale + stretch */}
      <motion.div
        initial={false}
        animate={{
          scale: active ? [1, 1.1, 1] : 1,
          scaleY: active ? [1, 1.25, 1] : 1,
          y: active ? [-2, -5, 0] : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}