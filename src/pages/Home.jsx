import React, { useState, useEffect, useRef } from 'react';
import { Users, ListMusic, Mic2, Play, Pause, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useUIContext } from '../context/UIContext';
import NavigationBar from '../components/NavigationBar';
import SongQueue from '../components/SongQueue';
import VibersPopup from '../components/VibersPopup';
import ProfilePopup from '../components/ProfilePopup';
import { AnimatedThumb } from '../components/ThumbAnimation';
import { useAudio } from '../context/AudioProvider';

export default function Home() {
  const { setIsSongQueueOpen, setIsVibersPopupOpen } = useUIContext();
  const [showQueue, setShowQueue] = useState(false);
  const [showVibers, setShowVibers] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const [userPhoto, setUserPhoto] = useState(null);
  const [progress, setProgress] = useState(0);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const { currentSong, isPlaying, setIsPlaying } = useAudio();

  /* Load profile */
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem('profile') || 'null');
    setUserPhoto(cached?.photo || null);

    const l = localStorage.getItem('liked');
    const d = localStorage.getItem('disliked');
    if (l === 'true') setLiked(true);
    if (d === 'true') setDisliked(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('liked', liked);
    localStorage.setItem('disliked', disliked);
  }, [liked, disliked]);

  return (
    <div className="min-h-screen w-full pb-36 px-4 pt-4 bg-white dark:bg-black text-black dark:text-white">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg"
          onClick={() => {
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

        {/* Profile */}
        <div className="relative">
          <div className="w-12 h-12 p-[2px] bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full">
            <img
              src={userPhoto}
              onClick={() => setShowProfilePopup(true)}
              className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800 cursor-pointer"
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

      {/* SONG ART */}
      <div className="flex flex-col items-center mt-4">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl bg-gray-300 dark:bg-gray-800 mb-3"
          style={{ width: 'min(80vw, 320px)', height: 'min(80vw, 320px)' }}
        >
          <img
            src={currentSong?.thumbnail_url ?? "https://placehold.co/300x300"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metadata */}
        <div className="w-full flex flex-col items-start px-2 mb-3">
          <h2 className="text-xl font-bold">{currentSong?.title ?? "No song playing"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentSong?.artist ?? ""}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => { setLiked(!liked); if (disliked) setDisliked(false); }}>
              <AnimatedThumb active={liked}>
                <ThumbsUp size={20} className={liked ? "text-blue-600" : "text-gray-500"} />
              </AnimatedThumb>
            </button>

            <button onClick={() => { setDisliked(!disliked); if (liked) setLiked(false); }}>
              <AnimatedThumb active={disliked}>
                <ThumbsDown size={20} className={disliked ? "text-red-600" : "text-gray-500"} />
              </AnimatedThumb>
            </button>
          </div>
        </div>
      </div>

      {/* PLAYER CONTROLS */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md">
          <Mic2 size={20} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white shadow-lg"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        <button
          onClick={() => { setShowQueue(true); setIsSongQueueOpen(true); }}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md"
        >
          <ListMusic size={20} />
        </button>
      </div>

      {!showQueue && !showVibers && <NavigationBar />}
    </div>
  );
}
