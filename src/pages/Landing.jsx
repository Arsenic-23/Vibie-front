import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react'; // Sleeker icon similar to YouTube Music

export default function Landing({ setIsLandingPage }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    window.navigator.vibrate?.([70, 100, 70]);
    setIsLandingPage(false);
    navigate('/home');
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/bg.jpg)' }}
    >
      {/* Overlay for Contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-0" />

      {/* Top Branding */}
      <div className="z-20 pt-14 flex items-center gap-2">
        <PlayCircle size={22} className="text-white" />
        <span className="text-white text-base font-bold tracking-wide drop-shadow-md">Vibie</span>
      </div>

      {/* Center Text */}
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-4 text-center px-6 tracking-tight leading-snug drop-shadow-xl">
          Over 100 million songs<br />and counting
        </h1>
        <p className="text-white text-base md:text-lg font-light text-center px-4 italic opacity-95">
          Tune in. Chill out. Feel every beat with Vibie.
        </p>
      </div>

      {/* Bottom Button */}
      <div className="z-20 pb-12">
        <button
          onClick={handleJoin}
          className="bg-white text-black font-medium rounded-full px-20 py-3 text-base md:text-lg shadow-xl transition-transform duration-150 ease-out active:scale-95 motion-safe:active:animate-tapShrink"
        >
          Join the Vibe
        </button>
      </div>
    </div>
  );
}