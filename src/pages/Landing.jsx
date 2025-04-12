import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pause, Play } from 'lucide-react';

const thumbnails = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",
];

export default function Landing({ setIsLandingPage }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const carouselRef = useRef(null);
  const touchStartX = useRef(null);
  const backgroundAudioRef = useRef(new Audio('/sounds/ambient-loop.mp3'));

  const handleJoin = () => {
    window.navigator.vibrate?.([10, 40, 10]);
    setIsLandingPage(false);
    navigate('/home');

    const sound = new Audio('/sounds/button-tap.mp3');
    sound.play();

    const audio = backgroundAudioRef.current;
    audio.loop = true;
    audio.volume = 0.4;
    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  const togglePlay = () => {
    const audio = backgroundAudioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      backgroundAudioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % thumbnails.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current !== null) {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 30) {
          setCurrentIndex((prev) =>
            (prev + (deltaX > 0 ? -1 : 1) + thumbnails.length) % thumbnails.length
          );
        }
        touchStartX.current = null;
      }
    };

    const node = carouselRef.current;
    if (node) {
      node.addEventListener('touchstart', handleTouchStart);
      node.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (node) {
        node.removeEventListener('touchstart', handleTouchStart);
        node.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-[#ffe1f9] via-[#fddaff] to-[#e0e7ff] text-black overflow-hidden">
      {/* Branding */}
      <div className="absolute top-8 text-center z-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-indigo-500 to-blue-500 drop-shadow-lg font-sans">
          Vibie
        </h1>
        <p className="mt-2 text-base md:text-lg text-neutral-700 font-medium">
          Feel the music, live the vibe
        </p>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="absolute top-28 w-full flex justify-center z-10 h-[320px] perspective-[1200px]"
      >
        <div className="relative w-[400px] h-[320px] transform-style-preserve-3d transition-transform duration-1000 ease-in-out">
          {thumbnails.map((thumb, i) => {
            const offset = ((i - currentIndex + thumbnails.length) % thumbnails.length);
            const angle = offset * 40;
            const zIndex = Math.round(thumbnails.length - offset);
            const opacity = offset === 0 ? 1 : 0.3;

            return (
              <img
                key={i}
                src={thumb}
                alt={`thumb-${i}`}
                className="absolute w-[260px] h-[260px] object-cover rounded-2xl shadow-2xl transition-all duration-1000 ease-in-out"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(500px)`,
                  transformOrigin: 'center center',
                  zIndex,
                  opacity,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute bottom-10 z-30 flex gap-4 justify-center items-center">
        <button
          onClick={handleJoin}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-full text-base tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Join the Vibe
        </button>

        <button
          onClick={togglePlay}
          className="bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-indigo-500 hover:to-purple-600 text-white p-3 rounded-full shadow-md transition-all duration-300"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
    </div>
  );
}