import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Check } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleJoin = () => {
    setIsLoading(true);
    setFillProgress(0);
    setShowCheckmark(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setFillProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setShowCheckmark(true);

        setTimeout(() => {
          navigate('/stream');
        }, 600);
      }
    }, 16);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/bg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      {/* Logo */}
      <div className="z-20 pt-14 flex items-center gap-2">
        <PlayCircle size={22} className="text-purple-400 drop-shadow-lg" />
        <span className="text-white text-base font-bold tracking-wide drop-shadow-md">
          Vibie
        </span>
      </div>

      {/* Heading */}
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center px-6 tracking-tight leading-snug drop-shadow-xl">
          Over 100 million songs<br />and counting
        </h1>
      </div>

      {/* CTA */}
      <div className="z-20 pb-12 flex flex-col items-center gap-4">
        <p className="text-white text-sm md:text-base font-light opacity-90">
          Crafted for those who live in rhythm.
        </p>

        <div className="relative w-[240px]">
          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="relative w-full py-3 rounded-full bg-white text-black font-semibold text-base md:text-lg overflow-hidden transition-all duration-300 ease-in-out active:scale-[0.98]"
          >
            {/* Progress Fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full z-0"
              style={{
                width: `${fillProgress}%`,
                transition: 'width 0.15s linear',
                background: 'linear-gradient(90deg, #a855f7, #9333ea)',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)',
              }}
            />

            {/* Button Text / Checkmark */}
            <div className="relative z-10 flex items-center justify-center transition-opacity duration-300">
              {!showCheckmark ? (
                <span
                  className={`transition-opacity ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Join the Vibe
                </span>
              ) : (
                <Check
                  size={22}
                  className="text-white transition-transform duration-300 scale-100"
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
