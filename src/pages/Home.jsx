import React, { useState, useEffect, useRef } from 'react';
import { Users, ListMusic, Mic2, Play, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useUIContext } from '../context/UIContext';
import NavigationBar from '../components/NavigationBar';
import SongQueue from '../components/SongQueue';
import VibersPopup from '../components/VibersPopup';
import ProfilePopup from '../components/ProfilePopup';
import PlayPauseButton from '../components/PlayPauseButton';
import { AnimatedThumb } from '../components/ThumbAnimation';

export default function Home() {
  const { setIsSongQueueOpen, setIsVibersPopupOpen } = useUIContext();
  const [showQueue, setShowQueue] = useState(false);
  const [showVibers, setShowVibers] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [progress, setProgress] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser?.photo_url) setUserPhoto(tgUser.photo_url);

    const storedLiked = localStorage.getItem('liked');
    const storedDisliked = localStorage.getItem('disliked');
    if (storedLiked === 'true') setLiked(true);
    if (storedDisliked === 'true') setDisliked(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('liked', liked);
    localStorage.setItem('disliked', disliked);
  }, [liked, disliked]);

  const fetchLyrics = async () => {
    try {
      const res = await fetch('https://vibie-backend.onrender.com/lyrics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await res.json();
      alert(data.lyrics || 'Lyrics not found.');
    } catch (err) {
      alert('Failed to fetch lyrics.');
    }
  };

  const progressColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'white' : 'black';
  const popupVisible = showQueue || showVibers;

  return (
    <div
      className="min-h-screen w-full pb-36 px-4 pt-4 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-300"
      style={{
        overscrollBehavior: 'none',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <style>{`* { -webkit-tap-highlight-color: transparent; }`}</style>

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          ref={vibersBtnRef}
          className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg"
          onClick={() => {
            navigator.vibrate?.([70, 30, 70]);
            setShowVibers(true);
            setIsVibersPopupOpen(true);
          }}
        >
          <Users size={20} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <Play size={20} className="text-purple-500" />
          <span className="text-base font-semibold">Vibie</span>
        </div>

        <div className="relative">
          <div className="w-12 h-12 p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full">
            <img
              src={userPhoto || 'https://placehold.co/thumbnail'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800 cursor-pointer"
              onClick={() => setShowProfilePopup(true)}
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

      {/* Popups */}
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
      <div className="flex flex-col items-center mt-2">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl bg-gray-300 dark:bg-gray-800 mb-3"
          style={{
            width: 'min(80vw, 320px)',
            height: 'min(80vw, 320px)',
          }}
        >
          <img
            src="https://placehold.co/thumbnail"
            alt="Now Playing"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full flex flex-col items-start px-2 mb-3">
          <h2 className="text-xl font-bold">Song Title</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Artist Name</p>
          <div className="flex items-center gap-4 mt-2">
            {/* Like Button */}
            <button
              onClick={() => {
                setLiked(!liked);
                if (disliked) setDisliked(false);
              }}
              className={`p-2 rounded-full transition-all duration-200 transform focus:outline-none focus:ring-0`}
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <AnimatedThumb active={liked}>
                <ThumbsUp
                  size={20}
                  className={`transition-colors duration-200 ${
                    liked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                />
              </AnimatedThumb>
            </button>

            {/* Dislike Button */}
            <button
              onClick={() => {
                setDisliked(!disliked);
                if (liked) setLiked(false);
              }}
              className={`p-2 rounded-full transition-all duration-200 transform focus:outline-none focus:ring-0`}
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <AnimatedThumb active={disliked}>
                <ThumbsDown
                  size={20}
                  className={`transition-colors duration-200 ${
                    disliked ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'
                  }`}
                />
              </AnimatedThumb>
            </button>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full px-4 mt-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="w-full appearance-none"
          style={{
            background: `linear-gradient(to right, ${progressColor} ${progress}%, rgba(128,128,128,0.2) ${progress}%)`,
            height: '4px',
            borderRadius: '999px',
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 14px;
            width: 14px;
            margin-top: -5px;
            background: ${progressColor};
            border-radius: 50%;
            box-shadow: 0 0 3px rgba(0,0,0,0.3);
            transition: transform 0.2s ease;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            height: 4px;
            background: transparent;
          }
        `}</style>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          <span>{Math.floor((progress / 100) * 3.75)}:{String(Math.floor((progress / 100) * 3.75 * 60 % 60)).padStart(2, '0')}</span>
          <span>3:45</span>
        </div>
      </div>

      {/* Player Buttons */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          onClick={fetchLyrics}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md"
        >
          <Mic2 size={20} />
        </button>
        <PlayPauseButton isPlaying={isPlaying} onClick={() => setIsPlaying(!isPlaying)} />
        <button
          ref={queueBtnRef}
          onClick={() => {
            navigator.vibrate?.([70, 30, 70]);
            setShowQueue(true);
            setIsSongQueueOpen(true);
          }}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md"
        >
          <ListMusic size={20} />
        </button>
      </div>

      {!popupVisible && <NavigationBar />}
    </div>
  );
}