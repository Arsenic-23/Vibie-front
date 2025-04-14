import React, { useEffect } from 'react'; import { useNavigate } from 'react-router-dom'; import { Music } from 'lucide-react'; // Lucide music icon

export default function Landing({ setIsLandingPage }) { const navigate = useNavigate();

const handleJoin = () => { window.navigator.vibrate?.([70, 100, 70]); setIsLandingPage(false); navigate('/home'); };

useEffect(() => { const video = document.getElementById('bg-video'); if (video) { video.play().catch(() => {}); } }, []);

return ( <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center"> {/* Background Video */} <video
id="bg-video"
className="absolute top-0 left-0 w-full h-full object-cover"
src="/videos/bg-loop.mp4"
autoPlay
muted
loop
playsInline
/>

{/* Top Branding */}
  <div className="z-20 pt-6 flex items-center gap-2">
    <Music size={18} className="text-white" />
    <span className="text-white text-xs font-medium tracking-wider">Vibie</span>
  </div>

  {/* Center Text */}
  <div className="z-10 flex flex-col items-center">
    <h1 className="text-white text-xl md:text-2xl font-medium mb-6 text-center px-4">
      Over 100 million songs and counting
    </h1>
  </div>

  {/* Bottom Button */}
  <div className="z-20 pb-10">
    <button
      onClick={handleJoin}
      className="bg-white text-black font-medium rounded-full px-12 py-4 text-base md:text-lg shadow-xl active:scale-[0.94] transition-transform duration-150 ease-out"
    >
      Join the Vibe
    </button>
  </div>

  {/* Overlay for Contrast */}
  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 z-0" />
</div>

); }

