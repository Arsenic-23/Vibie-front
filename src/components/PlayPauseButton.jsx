import { motion, AnimatePresence } from 'framer-motion';

const playPath = "M6 4L20 12L6 20V4Z";
const pauseLeft = "M6 5H10V19H6z";
const pauseRight = "M14 5H18V19H14z";

export default function PlayPauseButton({ isPlaying, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-white text-black dark:bg-white dark:text-black shadow-xl flex items-center justify-center"
      whileTap={{ scale: 0.9 }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <AnimatePresence mode="wait" initial={false}>
          {isPlaying ? (
            <>
              <motion.path
                key="pause-left"
                d={pauseLeft}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2 }}
              />
              <motion.path
                key="pause-right"
                d={pauseRight}
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.2 }}
              />
            </>
          ) : (
            <motion.path
              key="play"
              d={playPath}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>
      </svg>
    </motion.button>
  );
}