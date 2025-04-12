// NavigationBar.jsx
import React, { useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationBar({ visible = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);
  let pressTimer;

  const handleLongPressStart = (label) => {
    window.navigator.vibrate?.([30, 20, 30]);
    pressTimer = setTimeout(() => setPopup(label), 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer);
    setPopup(null);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-3 left-1/2 transform -translate-x-1/2
          bg-white/90 dark:bg-neutral-900/80
          text-neutral-800 dark:text-neutral-100
          rounded-full px-3 py-1.5
          flex justify-around items-center z-50 w-[60%] max-w-xs
          shadow-lg backdrop-blur-md border border-neutral-300 dark:border-neutral-700"
        >
          <NavItem {...{ icon: <Home size={16} />, label: "Home", path: "/home", currentPath: location.pathname, navigate, onLongPressStart: handleLongPressStart, onLongPressEnd: handleLongPressEnd }} />
          <NavItem {...{ icon: <Search size={16} />, label: "Search", path: "/search", currentPath: location.pathname, navigate, onLongPressStart: handleLongPressStart, onLongPressEnd: handleLongPressEnd }} />
          <NavItem {...{ icon: <Compass size={16} />, label: "Explore", path: "/explore", currentPath: location.pathname, navigate, onLongPressStart: handleLongPressStart, onLongPressEnd: handleLongPressEnd }} />
          <NavItem {...{ icon: <User size={16} />, label: "Profile", path: "/profile", currentPath: location.pathname, navigate, onLongPressStart: handleLongPressStart, onLongPressEnd: handleLongPressEnd }} />

          {popup && (
            <div className="absolute bottom-14 bg-black/80 text-white px-2.5 py-1 rounded text-xs shadow-sm dark:bg-white/10">
              {popup}
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function NavItem({ icon, label, path, currentPath, navigate, onLongPressStart, onLongPressEnd }) {
  const isActive = currentPath === path;

  const handleClick = () => {
    window.navigator.vibrate?.([10, 15, 10]);
    navigate(path);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => onLongPressStart(label)}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={() => onLongPressStart(label)}
      onTouchEnd={onLongPressEnd}
      className={`flex flex-col items-center justify-center px-2 py-0.5 transition-all duration-200 ${
        isActive
          ? 'text-primary dark:text-white scale-105 font-semibold'
          : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}