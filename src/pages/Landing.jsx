import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [speedStage, setSpeedStage] = useState(0);
  const [comets] = useState(generateComets(8)); // More = more comets

  const speedMap = [2500, 1500, 1000];

  const handleJoin = () => {
    window.navigator.vibrate?.(30);
    setIsLandingPage(false); // Unlock the app for navigation
    navigate('/home'); // Navigate to the home page
  };

  useEffect(() => {
    let currentStage = 0;
    const advanceStage = () => {
      currentStage = (currentStage + 1) % speedMap.length;
      setSpeedStage(currentStage);
    };
    const stageInterval = setInterval(advanceStage, 8000);
    return () => clearInterval(stageInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % thumbnails.length);
    }, speedMap[speedStage]);
    return () => clearInterval(interval);
  }, [speedStage]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white overflow-hidden">
      {/* Fancy layered background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] opacity-95" />
        <div className="absolute top-[10%] left-[30%] w-[500px] h-[500px] bg-purple-800/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] animate-ping" />
        <div className="absolute inset-0 bg-[url('/images/stars.png')] bg-cover opacity-10 mix-blend-screen pointer-events-none" />
        
        {/* Shooting comets */}
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

      {/* 3D carousel */}
      <div className="absolute top-10 w-full flex justify-center z-10 h-[320px] perspective-[1200px]">
        <div className="relative w-[400px] h-[320px] transform-style-preserve-3d">
          {thumbnails.map((thumb, i) => {
            const offset = (i - currentIndex + thumbnails.length) % thumbnails.length;
            const angle = offset * 40;
            const zIndex = thumbnails.length - offset;
            const opacity = offset === 0 ? 1 : 0.3;

            return (
              <img
                key={i}
                src={thumb}
                alt={`thumb-${i}`}
                className="absolute w-[260px] h-[260px] object-cover rounded-2xl transition-all duration-700 ease-in-out shadow-2xl"
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

      {/* Logo */}
      <h1 className="z-20 text-6xl sm:text-7xl font-extrabold tracking-widest mt-[400px] mb-10 font-['Poppins'] drop-shadow-2xl">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400">
          VIBIE
        </span>
      </h1>

      {/* Join button */}
      <button
        onClick={handleJoin}
        className="z-20 bg-white/10 text-white font-semibold px-10 py-4 rounded-full text-lg tracking-wider border border-white/30 shadow-lg backdrop-blur-md hover:shadow-white/30 transition-all duration-300"
      >
        <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text">
          Join the Vibe
        </span>
      </button>
    </div>
  );
}