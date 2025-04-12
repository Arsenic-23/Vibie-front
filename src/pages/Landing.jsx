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

function generateComets(num) {
  return Array.from({ length: num }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${1 + Math.random() * 2}s`,
  }));
}

export default function Landing({ setIsLandingPage }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comets] = useState(generateComets(8));
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
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#050505] via-[#111111] to-[#1b1b1b] text-white overflow-hidden">
      {/* Static Background Stars */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/stars.png')] bg-cover opacity-10 mix-blend-screen pointer-events-none" />
        {comets.map((comet) => (
          <div
            key={comet.id}
            className="comet"
            style={{
              top: comet.top,
              left: comet.left,
              animationDelay: comet.delay,
              animationDuration: comet.duration,
            }}
          />
        ))}
      </div>

      {/* Play/Pause Toggle Button */}
      <button
        onClick={togglePlay}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 text-white p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Smooth 3D Carousel */}
      <div
        ref={carouselRef}
        className="absolute top-10 w-full flex justify-center z-10 h-[320px] perspective-[1200px]"
      >
        <div className="relative w-[400px] h-[320px] transform-style-preserve-3d transition-transform duration-1000 ease-in-out">
          {thumbnails.map((thumb, i) => {
            const offset = ((i - currentIndex + thumbnails.length) % thumbnails.length);
            const angle = offset * 40;
            const zIndex = Math.round(thumbnails.length - offset);
            const opacity = offset === 0 ? 1 : 0.25;

            return (
              <img
                key={i}
                src={thumb}
                alt={`thumb-${i}`}
                className="absolute w-[260px] h-[260px] object-cover rounded-2xl shadow-2xl transition-all duration-1000 ease-in-out"
                style={{
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(500px)
                  `,
                  transformOrigin: 'center center',
                  zIndex,
                  opacity,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Stylish Join Button */}
      <button
        onClick={handleJoin}
        className="z-20 bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-sky-500 text-white font-semibold px-8 py-3 rounded-full text-base tracking-wide shadow-xl backdrop-blur-md border border-white/10 hover:shadow-white/30 transition-all duration-300 mt-[380px] hover:scale-105 active:scale-95"
      >
        Join the Vibe
      </button>
    </div>
  );
}