import React, { useState, useEffect, useRef } from 'react';
import NavigationBar from '../components/NavigationBar';
import ThemeToggle from '../components/ThemeToggle';
import SongQueue from '../components/SongQueue';
import VibersPopup from '../components/VibersPopup';
import SongControls from '../components/SongControls';
import { Users, ListMusic, Mic2 } from 'lucide-react';
import { useUIContext } from '../context/UIContext';

export default function Home() {
  const { setIsSongQueueOpen, setIsVibersPopupOpen } = useUIContext();
  const [showQueue, setShowQueue] = useState(false);
  const [showVibers, setShowVibers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  useEffect(() => {
    const setupLongPress = (ref, onLongPress) => {
      let pressTimer = null;

      const handlePressStart = () => {
        pressTimer = setTimeout(() => {
          navigator.vibrate?.([100, 50, 100]);
          onLongPress();
        }, 500);
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

    const cleanupVibers = setupLongPress(vibersBtnRef, () => {
      setShowVibers(true);
      setIsVibersPopupOpen(true);
    });

    const cleanupQueue = setupLongPress(queueBtnRef, () => {
      setShowQueue(true);
      setIsSongQueueOpen(true);
    });

    return () => {
      cleanupVibers();
      cleanupQueue();
    };
  }, [setIsSongQueueOpen, setIsVibersPopupOpen]);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.photo_url) {
      setUserPhoto(tgUser.photo_url);
    }
  }, []);

  const popupVisible = showQueue || showVibers;

  const handleQueueClick = () => {
    navigator.vibrate?.([70, 30, 70]);
    setShowQueue(true);
    setIsSongQueueOpen(true);
  };

  const handleVibersClick = () => {
    navigator.vibrate?.([70, 30, 70]);
    setShowVibers(true);
    setIsVibersPopupOpen(true);
  };

  const fetchLyrics = async () => {
    try {
      const res = await fetch(`https://vibie-backend.onrender.com/lyrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await res.json();
      alert(data.lyrics || 'Lyrics not found.');
    } catch (err) {
      console.error('Lyrics fetch error:', err);
      alert('Failed to fetch lyrics.');
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-5 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <button
            ref={vibersBtnRef}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
            onClick={handleVibersClick}
          >
            <Users size={20} />
          </button>
          <ThemeToggle />
        </div>
        <img
          src={userPhoto || "https://placehold.co/40x40"}
          alt="Profile"
          className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-gray-800 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        />
      </div>

      {/* Profile Section */}
      {showProfile && (
        <div className="absolute top-16 left-4 z-30 w-64 bg-white/90 dark:bg-[#111111] backdrop-blur-lg p-5 rounded-3xl shadow-2xl">
          <h3 className="text-xl font-bold mb-1">Profile</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Your user information goes here.</p>
        </div>
      )}

      {/* Modals */}
      {showVibers && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowVibers(false);
              setIsVibersPopupOpen(false);
            }}
          />
          <VibersPopup onClose={() => {
            setShowVibers(false);
            setIsVibersPopupOpen(false);
          }} />
        </div>
      )}

      {showQueue && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowQueue(false);
              setIsSongQueueOpen(false);
            }}
          />
          <SongQueue onClose={() => {
            setShowQueue(false);
            setIsSongQueueOpen(false);
          }} />
        </div>
      )}

      {/* Song Art */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-full max-w-sm h-[42vh] rounded-3xl overflow-hidden shadow-2xl bg-gray-300 dark:bg-gray-800 mb-4">
          <img
            src="https://placehold.co/600x600"
            alt="Now Playing"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Song Title</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Artist Name</p>
      </div>

      {/* Player + Action Buttons */}
      <div className="my-6 relative flex items-center justify-center gap-6">
        {/* Lyrics Button on Left */}
        <button
          onClick={fetchLyrics}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Mic2 size={20} />
        </button>

        {/* Song Controls Center */}
        <SongControls size="large" />

        {/* Queue Button on Right */}
        <button
          ref={queueBtnRef}
          onClick={handleQueueClick}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <ListMusic size={20} />
        </button>
      </div>

      {/* Bottom Navigation */}
      {!popupVisible && <NavigationBar />}
    </div>
  );
}