import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-14 h-8 flex items-center px-1 rounded-full transition-all duration-300 ${
        darkMode ? 'bg-yellow-400' : 'bg-gray-700'
      }`}
      title="Toggle theme"
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform ${
          darkMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-black'
        }`}
      >
        {darkMode ? (
          <Moon size={16} className="text-yellow-400" />
        ) : (
          <Sun size={16} className="text-white" />
        )}
      </div>
    </button>
  );
}