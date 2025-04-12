import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

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
  const [direction, setDirection] = useState(1);
  const [comets] = useState(generateComets(8));
  const [isSoundOn, setIsSoundOn] = useState(true);

  const carouselRef = useRef(null);
  const touchStartX = useRef(null);
  const backgroundAudioRef = useRef(null);

  const handleJoin = () => {
    window.navigator.vibrate?.([10, 40, 10]);
    setIsLandingPage(false);
    navigate('/home');

    const sound = new Audio('/sounds/button-tap.mp3');
    sound.play();
  };

  const toggleSound = () => {
    setIsSoundOn((prev) => {
      const newState = !prev;
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.muted = !newState;
      }
      return newState;
    });
  };

  useEffect(() => {
    const audio = new Audio('/sounds/ambient-loop.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = !isSoundOn;
    audio.play().catch(() => {});
    backgroundAudioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.muted = !isSoundOn;
    }
  }, [isSoundOn]);

  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const update = (now) => {
      const delta = now - lastTime;
      const speedFactor = 0.002;
      setCurrentIndex((prev) => {
        let next = prev + delta * speedFactor * direction;
        if (next >= thumbnails.length || next <= 0) {
          setDirection((d) => -d);
        }
        return next;
      });
      lastTime = now;
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [direction]);

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
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] opacity-95" />
        <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-purple-800/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] animate-ping" />
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

      {/* Sound Toggle Button - Bottom Right */}
      <button
        onClick={toggleSound}
        className="absolute bottom-6 right-6 z-30 bg-white/10 text-white p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200"
      >
        {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* 3D Carousel */}
      <div
        ref={carouselRef}
        className="absolute top-10 w-full flex justify-center z-10 h-[320px] perspective-[1200px]"
      >
        <div className="relative w-[400px] h-[320px] transform-style-preserve-3d">
          {thumbnails.map((thumb, i) => {
            const offset = ((i - currentIndex + thumbnails.length) % thumbnails.length);
            const angle = offset * 40;
            const zIndex = Math.round(thumbnails.length - offset);
            const opacity = offset < 0.5 || offset > thumbnails.length - 0.5 ? 1 : 0.3;

            return (
              <img
                key={i}
                src={thumb}
                alt={`thumb-${i}`}
                className="absolute w-[260px] h-[260px] object-cover rounded-2xl transition-all duration-500 ease-linear shadow-2xl"
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

      {/* Neon Animated Logo */}
      <h1 className="z-20 text-7xl sm:text-8xl font-extrabold tracking-widest mt-[200px] mb-12 font-['Poppins'] drop-shadow-2xl relative">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 animate-neon-glow">
          VIBIE
        </span>
        <style jsx="true">{`
          @keyframes neon-glow {
            0% { text-shadow: 0 0 5px #f0f, 0 0 10px #f0f, 0 0 20px #f0f; }
            50% { text-shadow: 0 0 10px #ff0, 0 0 20px #ff0, 0 0 40px #ff0; }
            100% { text-shadow: 0 0 5px #f0f, 0 0 10px #f0f, 0 0 20px #f0f; }
          }
          .animate-neon-glow {
            animation: neon-glow 3s infinite ease-in-out;
          }
        `}</style>
      </h1>

      {/* Join Button */}
      <button
        onClick={handleJoin}
        className="z-20 bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text font-semibold px-12 py-6 rounded-full text-lg tracking-wider border border-white/30 shadow-lg backdrop-blur-md hover:shadow-white/30 transition-all duration-300 mt-10 scale-100 animate-pulse"
      >
        <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text">
          Join the Vibe
        </span>
      </button>
    </div>
  );
}