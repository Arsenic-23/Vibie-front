import { motion, useCycle } from 'framer-motion';
const playPath = "M6 4L20 12L6 20V4Z"; // triangle
const pausePath = "M6 5H9V19H6z M15 5H18V19H15z"; 

export default function PlayPauseButton({ isPlaying, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="w-16 h-16 rounded-full bg-white text-black dark:bg-white dark:text-black shadow-xl flex items-center justify-center"
    >
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isPlaying ? (
          <>
            <motion.rect
              x="6"
              y="5"
              width="4"
              height="14"
              rx="1"
              initial={{ scaleY: 0.5, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            />
            <motion.rect
              x="14"
              y="5"
              width="4"
              height="14"
              rx="1"
              initial={{ scaleY: 0.5, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
            />
          </>
        ) : (
          <motion.path
            d="M6 4L20 12L6 20V4Z"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          />
        )}
      </svg>
    </motion.button>
  );
}