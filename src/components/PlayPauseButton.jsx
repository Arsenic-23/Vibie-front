import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const playPath = "M6 4L20 12L6 20V4Z";
const pausePath = "M6 5H9V19H6z M15 5H18V19H15z"; 

const pauseLeft = "M6 5H10V19H6Z";
const pauseRight = "M14 5H18V19H14Z";

export default function PlayPauseButton({ isPlaying, onClick }) {
  const [paths, setPaths] = useState({
    left: playPath,
    right: null,
  });

  useEffect(() => {
    if (isPlaying) {
      setPaths({
        left: pauseLeft,
        right: pauseRight,
      });
    } else {
      setPaths({
        left: playPath,
        right: null,
      });
    }
  }, [isPlaying]);

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="w-16 h-16 rounded-full bg-white text-black dark:bg-white dark:text-black shadow-xl flex items-center justify-center"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={paths.left}
          animate={{ d: paths.left }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />
        {paths.right && (
          <motion.path
            d={paths.right}
            animate={{ d: paths.right }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              delay: 0.05,
            }}
          />
        )}
      </svg>
    </motion.button>
  );
}