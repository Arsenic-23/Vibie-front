import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const thumbnails = [
  "https://i.scdn.co/image/ab67616d0000b2735f6e5db9dfe9e659cf7f6b88",
  "https://i.scdn.co/image/ab67616d0000b2734173a7ae91b73db5c2fefbbb",
  "https://i.scdn.co/image/ab67616d0000b273ff9c49881fa6b79e7be04f5c",
  "https://i.scdn.co/image/ab67616d0000b273b4b8cc41e582b2f50f6689a7",
  "https://i.scdn.co/image/ab67616d0000b273a08ef9c3e2dbd3118099dc3f",
  "https://i.scdn.co/image/ab67616d0000b2734d3b56a37e3fc0c2976277d3",
];

export default function Landing() {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(thumbnails[0]);

  const handleJoin = () => {
    window.navigator.vibrate?.(30);
    navigate('/home');
  };

  const handleThumbnailClick = () => {
    console.log("Thumbnail clicked!");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setThumbnail((prev) => {
        const nextIndex = (thumbnails.indexOf(prev) + 1) % thumbnails.length;
        return thumbnails[nextIndex];
      });
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1f005c] via-[#5b0060] to-[#870160] text-white text-center px-4">

      {/* Rotating thumbnail */}
      <img
        src={thumbnail}
        alt="Album Thumbnail"
        onClick={handleThumbnailClick}
        className="w-36 h-36 rounded-xl shadow-lg mb-6 cursor-pointer animate-[spin_10s_linear_infinite]"
      />

      {/* Logo */}
      <h1 className="text-6xl sm:text-7xl font-extrabold tracking-wider mb-6 font-['Poppins'] drop-shadow-xl">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
          VIBIE
        </span>
      </h1>

      {/* Tagline */}
      <p className="text-lg font-light mb-10 max-w-md text-white/80">
        Stream music together in real-time. Feel the vibe. Live the music.
      </p>

      {/* Join Button */}
      <button
        onClick={handleJoin}
        className="bg-white text-purple-700 font-bold px-10 py-4 rounded-full text-lg tracking-wide border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-white/40 transition-all duration-300"
      >
        <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-transparent bg-clip-text">
          Join the Vibe
        </span>
      </button>
    </div>
  );
}