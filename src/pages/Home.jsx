import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [songData, setSongData] = useState(null);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const joinId = queryParams.get('join');

  // Setup long press handlers
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

  // Fetch user photo if available
  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.photo_url) {
      setUserPhoto(tgUser.photo_url);
    }
  }, []);

  // Fetch stream details when joinId is available
  useEffect(() => {
    if (joinId) {
      fetch(`https://vibie-backend.onrender.com/stream/${joinId}`)
        .then((res) => res.json())
        .then((data) => {
          setSongData(data.song);  // Assuming backend returns song data in the 'song' field
        })
        .catch((error) => console.error('Error fetching stream:', error));
    }
  }, [joinId]);

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
          <p className="text-sm text-gray-600 dark:text-gray-300">Your user information goes here.</