import React, { useState, useEffect, useRef } from 'react';
import NavigationBar from '../components/NavigationBar';
import ThemeToggle from '../components/ThemeToggle';
import SongQueue from '../components/SongQueue';
import VibersPopup from '../components/VibersPopup';
import SongControls from '../components/SongControls';
import { Users, ListMusic } from 'lucide-react';

export default function Home() {
  const [showQueue, setShowQueue] = useState(false);
  const [showVibers, setShowVibers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  // Long press functionality
  useEffect(() => {
    const setupLongPress = (ref, onLongPress) => {
      let pressTimer = null;

      const handlePressStart = () => {
        pressTimer = setTimeout(() => onLongPress(), 500); // 500ms
      };

      const handlePressEnd = () => {
        clearTimeout(pressTimer);
      };

      const el = ref.current;
      if (el) {
        el.addEventListener('mousedown', handlePressStart);
        el.addEventListener('touchstart', handlePressStart);
        el.addEventListener('mouseup', handlePressEnd);
        el.addEventListener('mouseleave', handlePressEnd);
        el.addEventListener('touchend', handlePressEnd);
      }

      return () => {
        if (el) {
          el.removeEventListener('mousedown', handlePressStart);
          el.removeEventListener('touchstart', handlePressStart);
          el.removeEventListener('mouseup', handlePressEnd);
          el.removeEventListener('mouseleave', handlePressEnd);
          el.removeEventListener('touchend', handlePressEnd);
        }
      };
    };

    const cleanupVibers = setupLongPress(vibersBtnRef, () => setShowVibers(true));
    const cleanupQueue = setupLongPress(queueBtnRef, () => setShowQueue(true));

    return () => {
      cleanupVibers();
      cleanupQueue();
    };
  }, []);

  // Hide navigation when modals are open
  const popupVisible = showQueue || showVibers;

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <button
            ref={vibersBtnRef}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md text-sm font-medium hover:scale-105 transition-transform"
            onClick={() => setShowVibers(true)}
          >
            <Users size={16} />
            <span>Vibers</span>
          </button>
          <ThemeToggle />
        </div>
        <img
          src="https://placehold.co/40x40"
          alt="Profile"
          className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-gray-800 transition-transform duration-200 hover:scale-105 cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        />
      </div>

      {/* Profile Section */}
      {showProfile && (
        <div className="absolute top-16 left-4 z-30 w-64 bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Profile</h3>
          <p className="text-sm">This is the profile section</p>
        </div>
      )}

      {/* Modals */}
      {showVibers && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowVibers(false)}
          />
          <VibersPopup onClose={() => setShowVibers(false)} />
        </div>
      )}

      {showQueue && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowQueue(false)}
          />
          <SongQueue onClose={() => setShowQueue(false)} />
        </div>
      )}

      {/* Song Art */}
      <div className="flex flex-col items-center my-6">
        <div className="w-full max-w-sm h-[45vh] rounded-3xl shadow-2xl overflow-hidden mb-4">
          <img
            src="https://placehold.co/600x600"
            alt="Current Song"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold mb-1 text-center">Song Title</h2>
        <p className="text-base text-gray-500 dark:text-gray-300 text-center">
          Artist Name
        </p>
      </div>

      <div className="mb-16">
        <SongControls size="large" />
      </div>

      {/* Queue Floating Button */}
      {!popupVisible && (
        <div className="fixed bottom-24 right-4 z-40">
          <button
            ref={queueBtnRef}
            onClick={() => setShowQueue(true)}
            className="flex items-center space-x-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full shadow-md text-sm font-medium hover:scale-105 transition-transform"
          >
            <ListMusic size={16} />
            <span>Queue</span>
          </button>
        </div>
      )}

      {/* Bottom Nav */}
      {!popupVisible && <NavigationBar />}
    </div>
  );
}