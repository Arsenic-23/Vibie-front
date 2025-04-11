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
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 shadow-xl rounded-full px-6 py-2 flex justify-around items-center z-50 w-[85%] max-w-sm backdrop-blur-md border border-white/10">
      <NavItem
        icon={<Home size={20} strokeWidth={2.2} />}
        label="Home"
        path="/home"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<Search size={20} strokeWidth={2.2} />}
        label="Search"
        path="/search"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<Compass size={20} strokeWidth={2.2} />}
        label="Explore"
        path="/explore"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />
      <NavItem
        icon={<User size={20} strokeWidth={2.2} />}
        label="Profile"
        path="/profile"
        currentPath={location.pathname}
        navigate={navigate}
        onLongPressStart={handleLongPressStart}
        onLongPressEnd={handleLongPressEnd}
      />

      {popup && (
        <div className="absolute bottom-14 bg-black text-white px-3 py-1.5 rounded-md text-xs opacity-90 shadow-md transition-all duration-300">
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
          ? 'text-white scale-110 drop-shadow-md'
          : 'text-gray-300 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}