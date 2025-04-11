import React, { useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(null);
  let pressTimer;

  const handleLongPressStart = (label) => {
    pressTimer = setTimeout(() => setPopup(label), 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(pressTimer);
    setPopup(null);
  };

  return (
    <nav
      className="fixed bottom-3 left-1/2 transform -translate-x-1/2
      bg-gradient-to-r from-white via-neutral-100 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950
      text-neutral-900 dark:text-neutral-100
      shadow-xl rounded-full px-2 py-1
      flex justify-between items-center z-50 w-[90%] max-w-xs
      backdrop-blur-lg border border-neutral-300 dark:border-neutral-700
      transition-all duration-300"
    >
      <NavItem
        icon={<Home size={16} strokeWidth={2} />}
        label="Home"
        path="/home"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<Search size={16} strokeWidth={2} />}
        label="Search"
        path="/search"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<Compass size={16} strokeWidth={2} />}
        label="Explore"
        path="/explore"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<User size={16} strokeWidth={2} />}
        label="Profile"
        path="/profile"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />

      {popup && (
        <div className="absolute bottom-14 bg-black/90 dark:bg-white/10 text-white dark:text-white px-3 py-1.5 rounded-md text-sm opacity-95 shadow-md transition-all duration-300">
          {popup}
        </div>
      )}
    </nav>
  );
}

function NavItem({ icon, label, path, currentPath, navigate, onLongPressStart, onLongPressEnd }) {
  const isActive = currentPath === path;

  return (
    <button
      onClick={() => navigate(path)}
      onMouseDown={() => onLongPressStart(label)}
      onMouseUp={onLongPressEnd}
      onMouseLeave={onLongPressEnd}
      onTouchStart={() => onLongPressStart(label)}
      onTouchEnd={onLongPressEnd}
      className={`flex flex-col items-center transition-all duration-300 ${
        isActive
          ? 'text-primary dark:text-white scale-105 font-medium drop-shadow'
          : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}