import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedThumb({ children, active }) {
  return (
    <motion.div
      initial={false}
      animate={{
        scale: active ? [1, 1.3, 1] : 1,
        rotate: active ? [0, -10, 10, 0] : 0,
      }}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}