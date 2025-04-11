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
    }, 3000); // Speed up transitions
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black relative overflow-hidden text-white text-center px-4">

      {/* Blurred glassy background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-90 backdrop-blur-lg z-0"></div>

      {/* Rotating thumbnails */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex space-x-6 z-10">
        {thumbnails.map((thumb, i) => (
          <img
            key={i}
            src={thumb}
            alt={`thumb-${i}`}
            className={`w-20 h-20 rounded-xl shadow-lg animate-[spin_5s_linear_infinite] transition-opacity duration-500 ${
              currentIndex === i ? 'opacity-100' : 'opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-10 mt-60 sm:mt-80">
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-widest mb-6 font-['Poppins'] drop-shadow-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400">
            VIBIE
          </span>
        </h1>

        <p className="text-lg font-light mb-10 max-w-md text-white/80">
          Stream music together in real-time. Feel the vibe. Live the music.
        </p>

        <button
          onClick={handleJoin}
          className="bg-white/10 text-white font-semibold px-10 py-4 rounded-full text-lg tracking-wider border border-white/30 shadow-lg backdrop-blur-md hover:shadow-white/30 transition-all duration-300"
        >
          <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text">
            Join the Vibe
          </span>
        </button>
      </div>
    </div>
  );
}