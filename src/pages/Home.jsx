import React, { useState, useEffect, useRef } from 'react';
import { Users, ListMusic, Mic2, PlayCircle } from 'lucide-react';
import { useUIContext } from '../context/UIContext';
import NavigationBar from '../components/NavigationBar';
import SongQueue from '../components/SongQueue';
import VibersPopup from '../components/VibersPopup';
import SongControls from '../components/SongControls';
import ProfilePopup from '../components/ProfilePopup';

export default function Home() {
  const { setIsSongQueueOpen, setIsVibersPopupOpen } = useUIContext();
  const [showQueue, setShowQueue] = useState(false);
  const [showVibers, setShowVibers] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  useEffect(() => {
    const setupLongPress = (ref, onLongPress) => {
      let pressTimer = null;
      const start = () => (pressTimer = setTimeout(() => {
        navigator.vibrate?.([100, 50, 100]);
        onLongPress();
      }, 500));
      const clear = () => clearTimeout(pressTimer);

      const el = ref.current;
      el?.addEventListener('mousedown', start);
      el?.addEventListener('touchstart', start);
      el?.addEventListener('mouseup', clear);
      el?.addEventListener('mouseleave', clear);
      el?.addEventListener('touchend', clear);

      return () => {
        el?.removeEventListener('mousedown', start);
        el?.removeEventListener('touchstart', start);
        el?.removeEventListener('mouseup', clear);
        el?.removeEventListener('mouseleave', clear);
        el?.removeEventListener('touchend', clear);
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
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    if (tgUser?.photo_url) setUserPhoto(tgUser.photo_url);

    // Request fullscreen
    tg?.ready?.();
    tg?.requestFullscreen?.();
  }, []);

  const popupVisible = showQueue || showVibers;

  const fetchLyrics = async () => {
    try {
      const res = await fetch('https://vibie-backend.onrender.com/lyrics', {
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
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center space-x-3">
          <button
            ref={vibersBtnRef}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
            onClick={() => {
              navigator.vibrate?.([70, 30, 70]);
              setShowVibers(true);
              setIsVibersPopupOpen(true);
            }}
          >
            <Users size={20} />
          </button>
        </div>

        {/* Vibie Branding Centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <PlayCircle size={20} className="text-purple-500 drop-shadow-sm" />
          <span className="text-base font-semibold tracking-wide">Vibie</span>
        </div>

        {/* Profile with subtle ring */}
        <div className="relative">
          <div
            className={`w-12 h-12 p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full transition-transform duration-200 ${
              showProfilePopup ? 'scale-105' : ''
            }`}
          >
            <img
              src={userPhoto || "https://placehold.co/thumbnail"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800 cursor-pointer"
              onClick={() => {
                navigator.vibrate?.([60]);
                setShowProfilePopup(true);
              }}
            />
          </div>

          {showProfilePopup && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
              <div className="absolute z-50 right-0 mt-2">
                <ProfilePopup onClose={() => setShowProfilePopup(false)} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showVibers && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowVibers(false);
            setIsVibersPopupOpen(false);
          }} />
          <VibersPopup onClose={() => {
            setShowVibers(false);
            setIsVibersPopupOpen(false);
          }} />
        </div>
      )}

      {showQueue && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
            setShowQueue(false);
            setIsSongQueueOpen(false);
          }} />
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
            src="https://placehold.co/thumbnail"
            alt="Now Playing"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Song Title</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Artist Name</p>
      </div>

      {/* Player + Action Buttons */}
      <div className="my-6 relative flex items-center justify-center gap-6">
        <button
          onClick={fetchLyrics}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Mic2 size={20} />
        </button>
        <SongControls size="large" />
        <button
          ref={queueBtnRef}
          onClick={() => {
            navigator.vibrate?.([70, 30, 70]);
            setShowQueue(true);
            setIsSongQueueOpen(true);
          }}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <ListMusic size={20} />
        </button>
      </div>

      {!popupVisible && <NavigationBar />}
    </div>
  );
}