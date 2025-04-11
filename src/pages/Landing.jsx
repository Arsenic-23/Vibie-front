import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const thumbnails = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
  "/images/6.jpg",
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleJoin = () => {
    window.navigator.vibrate?.(30);
    navigate('/home');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % thumbnails.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-black text-white overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-[#1f1f1f] to-[#3a3a3a] opacity-90 backdrop-blur-xl" />

      {/* Curved thumbnail carousel */}
      <div className="absolute top-20 w-full flex justify-center z-10 h-[260px] perspective-[1200px]">
        <div className="relative w-[320px] h-[260px] transform-style-preserve-3d">
          {thumbnails.map((thumb, i) => {
            const offset = (i - currentIndex + thumbnails.length) % thumbnails.length;
            const angle = offset * 40; // Adjust for how spread out they are
            const zIndex = thumbnails.length - offset;
            const opacity = offset === 0 ? 1 : 0.3;

            return (
              <img
                key={i}
                src={thumb}
                alt={`thumb-${i}`}
                className="absolute w-[220px] h-[220px] object-cover rounded-2xl transition-all duration-700 ease-in-out shadow-2xl"
                style={{
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(400px)
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

      {/* Join Button */}
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