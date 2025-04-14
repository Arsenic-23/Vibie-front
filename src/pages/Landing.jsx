import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing({ setIsLandingPage }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    // Haptic feedback
    window.navigator.vibrate?.([50, 70, 100]);

    // Navigate and hide landing
    setIsLandingPage(false);
    navigate('/home');
  };

  useEffect(() => {
    const video = document.getElementById('bg-video');
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        id="bg-video"
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/bg-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Content Overlay */}
      <div className="z-10 flex flex-col items-center justify-center">
        <h1 className="text-white text-xl md:text-2xl font-medium mb-6 text-center px-4">
        </h1>

        {/* iOS-style tap animation button */}
        <button
          onClick={handleJoin}
          className="bg-white text-black font-medium rounded-full px-12 py-4 text-base md:text-lg shadow-xl active:scale-[0.94] transition-transform duration-150 ease-out"
        >
          Join the Vibe
        </button>
      </div>

      {/* Overlay for contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-0" />
    </div>
  );
}