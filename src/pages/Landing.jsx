import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react'; // Lucide music icon

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
      style={{ backgroundImage: 'url(/images/bg.jpg)' }} // Place bg.jpg in public/images
    >
      {/* Overlay for Contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-0" />

      {/* Top Branding */}
      <div className="z-20 pt-12 flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full shadow-sm">
        <Music size={18} className="text-white" />
        <span className="text-white text-sm font-semibold tracking-wide">Vibie</span>
      </div>

      {/* Center Text */}
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-2xl md:text-3xl font-semibold mb-3 text-center px-6 drop-shadow-md">
          Over 100 million songs and counting
        </h1>
        <p className="text-white text-sm md:text-base font-light text-center px-4 opacity-90">
             Feel every beat with Vibie.🚀
        </p>
      </div>

      {/* Bottom Button */}
      <div className="z-20 pb-12">
        <button
          onClick={handleJoin}
          className="bg-white text-black font-medium rounded-full px-16 py-4 text-base md:text-lg shadow-xl transition-transform duration-150 ease-out active:scale-95 motion-safe:active:animate-tapShrink"
        >
          Join the Vibe
        </button>
      </div>
    </div>
  );
}