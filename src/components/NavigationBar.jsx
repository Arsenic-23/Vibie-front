import React, { useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);
  let pressTimer;

  const handleLongPressStart = (label) => {
    window.navigator.vibrate?.([30, 20, 30]); // Medium impact
    pressTimer = setTimeout(() => setPopup(label), 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer);
    setPopup(null);
  };

  return (
    <nav
      className="fixed bottom-2 left-1/2 transform -translate-x-1/2
      bg-neutral-200 dark:bg-neutral-900/90
      text-neutral-800 dark:text-neutral-100
      rounded-2xl px-4 py-1.5
      flex justify-around items-center z-50 w-[85%] max-w-sm
      shadow-md dark:shadow-none backdrop-blur-md
      border border-neutral-300 dark:border-neutral-700"
    >
      <NavItem
        icon={<Home size={17} strokeWidth={2.1} />}
        label="Home"
        path="/home"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<Search size={17} strokeWidth={2.1} />}
        label="Search"
        path="/search"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<Compass size={17} strokeWidth={2.1} />}
        label="Explore"
        path="/explore"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<User size={17} strokeWidth={2.1} />}
        label="Profile"
        path="/profile"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />

      {popup && (
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2
          px-4 py-2 rounded-full text-sm text-white
          bg-black/70 dark:bg-white/10 backdrop-blur-md
          shadow-lg transition-all duration-300 scale-100 animate-popupIsland"
        >
          {popup}
        </div>
      )}
    </nav>
  );
}

function NavItem({ icon, label, path, currentPath, navigate, onLongPressStart, onLongPressEnd }) {
  const isActive = currentPath === path;

  const handleClick = () => {
    window.navigator.vibrate?.([10, 15, 10]); // Light tap
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
      className={`flex flex-col items-center justify-center px-1 transition-all duration-200 ${
        isActive
          ? 'text-primary dark:text-white scale-105 font-semibold'
          : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}