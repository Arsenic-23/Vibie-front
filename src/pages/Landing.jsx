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
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1f1c2c] via-[#5b247a] to-[#1f1c2c] text-white overflow-hidden">
      
      {/* Vibie Logo */}
      <div className="flex flex-col items-center z-20 mb-8">
        <img
          src="/images/vibie-logo.png"
          alt="Vibie Logo"
          className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg"
        />
        <p className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide">
          Feel the music, live the vibe
        </p>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="w-full flex justify-center z-10 h-[320px] perspective-[1200px]"
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
          className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-full text-base tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
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