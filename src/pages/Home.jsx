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
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const vibersBtnRef = useRef(null);
  const queueBtnRef = useRef(null);

  /** AUDIO PROVIDER */
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    seekTo
  } = useAudio();

  /** Progress % */
  const progress = duration ? (currentTime / duration) * 100 : 0;

  /** Load profile + likes */
  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("profile") || "null");
    setUserPhoto(cached?.photo || null);

    const l = localStorage.getItem("liked");
    const d = localStorage.getItem("disliked");
    if (l === "true") setLiked(true);
    if (d === "true") setDisliked(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("liked", liked);
    localStorage.setItem("disliked", disliked);
  }, [liked, disliked]);

  const fetchLyrics = async () => {
    try {
      const res = await fetch("https://vibie-backend.onrender.com/lyrics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const data = await res.json();
      alert(data.lyrics || "Lyrics not found.");
    } catch {
      alert("Failed to fetch lyrics.");
    }
  };

  const progressColor = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "white"
    : "black";

  const popupVisible = showQueue || showVibers;

  /* Convert time to MM:SS */
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full pb-36 px-4 pt-4 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-300">

      {/* ------------ TOP BAR ------------ */}
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

        {/* PROFILE */}
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

      {/* ------------ POPUPS ------------ */}
      {showVibers && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
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
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
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

      {/* ------------ SONG ART & META ------------ */}
      <div className="flex flex-col items-center mt-3">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl bg-gray-300 dark:bg-gray-800"
          style={{ width: "min(80vw, 320px)", height: "min(80vw, 320px)" }}
        >
          <img
            src={currentSong?.thumbnail_url ?? "https://placehold.co/300"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full mt-4 px-2 flex flex-col items-start">
          <h2 className="text-xl font-bold">
            {currentSong?.title ?? "No song playing"}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentSong?.artist ?? ""}
          </p>

          {/* LIKE / DISLIKE */}
          <div className="flex items-center gap-4 mt-3">
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

      {/* ------------ PROGRESS BAR ------------ */}
      <div className="w-full px-4 mt-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="w-full appearance-none"
          style={{
            background: `linear-gradient(to right, ${progressColor} ${progress}%, rgba(128,128,128,0.2) ${progress}%)`,
            height: "4px",
            borderRadius: "999px",
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
          }
        `}</style>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* ------------ PLAYER CONTROLS ------------ */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          onClick={fetchLyrics}
          className="p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-md"
        >
          <Mic2 size={20} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white shadow-lg"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

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
