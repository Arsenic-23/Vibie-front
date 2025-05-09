import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function DynamicWaveform({ isListening }) {
  const [amplitude, setAmplitude] = useState(0.2);
  const animationRef = useRef();

  useEffect(() => {
    if (!isListening) return;

    const updateAmplitude = () => {
      const newAmp = 0.2 + Math.random() * 0.6; // simulate input volume
      setAmplitude(newAmp);
      animationRef.current = requestAnimationFrame(updateAmplitude);
    };

    animationRef.current = requestAnimationFrame(updateAmplitude);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isListening]);

  const wavePath = (a = amplitude, w = 0.3, f = 2) => {
    let path = 'M 0 25 ';
    for (let i = 0; i <= 100; i++) {
      const x = i;
      const y = 25 - a * 20 * Math.sin((i * w * Math.PI) / 50 + f);
      path += `L ${x} ${y} `;
    }
    return path;
  };

  return (
    <motion.svg
      width="100"
      height="50"
      viewBox="0 0 100 50"
      className="text-purple-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: isListening ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.path
        d={wavePath()}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        animate={{ d: wavePath() }}
        transition={{ repeat: Infinity, duration: 0.2 }}
      />
    </motion.svg>
  );
}