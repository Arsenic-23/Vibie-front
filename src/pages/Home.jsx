import React, { useState, useEffect, useRef } from 'react';
import { Users, ListMusic, Mic2, Play, Pause, PlayCircle, Heart } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDotTapped, setIsDotTapped] = useState(false);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  useEffect(() => {
    const enableFullscreen = async () => {
      const tgWebApp = window.Telegram?.WebApp;
      if (tgWebApp?.initDataUnsafe && tgWebApp.viewport?.requestFullscreen) {
        await tgWebApp.viewport.requestFullscreen();
        tgWebApp.setHeaderColor('#ffffff');
      }
    };
    enableFullscreen();
  }, []);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.photo_url) setUserPhoto(tgUser.photo_url);
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
    <div className="min-h-screen pb-32 px-4 pt-5 bg-white dark:bg-black text-black dark:text-white relative overflow-hidden transition-colors duration-300">
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

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <PlayCircle size={20} className="text-purple-500 drop-shadow-sm" />
          <span className="text-base font-semibold tracking-wide">Vibie</span>
        </div>

        <div className="relative">
          <div className={`w-12 h-12 p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full ${showProfilePopup ? 'scale-105' : ''}`}>
            <img
              src={userPhoto || 'https://placehold.co/thumbnail'}
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
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gray-300 dark:bg-gray-800 mb-4">
          <img
            src="https://placehold.co/thumbnail"
            alt="Now Playing"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Heart className="text-pink-500" size={22} />
          <h2 className="text-2xl font-bold text-center">Song Title</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Artist Name</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-6 px-1">
        <div className="relative h-1.5 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="absolute h-full bg-white rounded-full transition-all duration-300" style={{ width: '40%' }} />
          <div
            onClick={() => {
              setIsDotTapped(true);
              setTimeout(() => setIsDotTapped(false), 200);
            }}
            className={`absolute left-[40%] -top-2.5 w-3.5 h-3.5 rounded-full bg-white shadow-md cursor-pointer transition-transform duration-200 ${isDotTapped ? 'scale-150' : 'scale-100'}`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          <span>1:24</span>
          <span>3:45</span>
        </div>
      </div>

      {/* Player + Action Buttons */}
      <div className="mt-10 relative flex items-center justify-center gap-6">
        <button
          onClick={fetchLyrics}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Mic2 size={20} />
        </button>

        <button
          className="w-16 h-16 rounded-full bg-white text-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={32} color="black" /> : <Play size={32} color="black" />}
        </button>

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