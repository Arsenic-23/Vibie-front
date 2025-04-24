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

  const [songQueue, setSongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

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

    setupLongPress(vibersBtnRef, () => setShowVibers(true));
    setupLongPress(queueBtnRef, () => setShowQueue(true));
  }, []);

  const handlePlaySong = (index) => {
    setCurrentIndex(index);
  };

  const handleAddSongToQueue = (song) => {
    setSongQueue((prevQueue) => [...prevQueue, song]);
    if (currentIndex === null) {
      setCurrentIndex(0); // Automatically start the first song if it's the first song added
    }
  };

  const handleToggleQueue = () => {
    setIsSongQueueOpen(!showQueue);
    setShowQueue(!showQueue);
  };

  const handleToggleVibers = () => {
    setIsVibersPopupOpen(!showVibers);
    setShowVibers(!showVibers);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white transition-all flex flex-col">
      <NavigationBar
        onProfileClick={() => setShowProfile(!showProfile)}
        profilePhoto={userPhoto}
      />
      <div className="flex flex-grow justify-center items-center py-10">
        <div className="max-w-xl w-full text-center">
          <h2 className="text-2xl font-semibold mb-6">Now Playing</h2>
          {currentIndex !== null ? (
            <div className="relative">
              <img
                src={songQueue[currentIndex].image}
                alt={songQueue[currentIndex].title}
                className="w-64 h-64 object-cover rounded-lg mx-auto"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
                <h3 className="text-lg font-semibold">{songQueue[currentIndex].title}</h3>
                <p className="text-sm">{songQueue[currentIndex].artist}</p>
              </div>
            </div>
          ) : (
            <p>No song playing</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-10 mt-8">
        <button
          ref={vibersBtnRef}
          onClick={handleToggleVibers}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <Users size={20} />
          <span className="text-sm">Vibers</span>
        </button>
        <button
          ref={queueBtnRef}
          onClick={handleToggleQueue}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <ListMusic size={20} />
          <span className="text-sm">Song Queue</span>
        </button>
        <button
          onClick={() => {}}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
        >
          <Mic2 size={20} />
          <span className="text-sm">Mic</span>
        </button>
      </div>

      {showQueue && <SongQueue songQueue={songQueue} onSelectSong={handlePlaySong} />}
      {showVibers && <VibersPopup />}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg max-w-lg w-full text-center">
            <img
              src={userPhoto || '/default-profile.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-lg font-semibold">User Profile</h2>
            <button
              onClick={() => setShowProfile(false)}
              className="mt-4 text-sm text-purple-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <SongControls
        onPlaySong={handlePlaySong}
        songQueue={songQueue}
        currentIndex={currentIndex}
        onAddSongToQueue={handleAddSongToQueue}
      />
    </div>
  );
}