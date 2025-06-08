import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Check } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
  }, []);

  const handleJoin = () => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();

    try {
      tg?.HapticFeedback?.impactOccurred('light');
    } catch (_) {}

    const user = tg?.initDataUnsafe?.user;

    if (!user) {
      alert("Please open this from inside Telegram.");
      return;
    }

    const userData = {
      telegram_id: user.id,
      first_name: user.first_name,
      username: user.username,
      photo_url: user.photo_url || '',
    };

    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('profile', JSON.stringify(userData));

    const queryParams = new URLSearchParams(window.location.search);
    const joinId = queryParams.get('join');

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
          navigate(joinId ? `/home?join=${joinId}` : '/home');
        }, 600);
      }
    }, 16); // ~60fps
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/bg.jpg)' }}
    >
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-0" />

      {/* App Title */}
      <div className="z-20 pt-14 flex items-center gap-2">
        <PlayCircle size={22} className="text-purple-400 drop-shadow-lg" />
        <span className="text-white text-base font-bold tracking-wide drop-shadow-md">Vibie</span>
      </div>

      {/* Tagline */}
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center px-6 tracking-tight leading-snug drop-shadow-xl">
          Over 100 million songs<br />and counting
        </h1>
      </div>

      {/* Join Button */}
      <div className="z-20 pb-12 flex flex-col items-center gap-4">
        <p className="text-white text-sm md:text-base font-light opacity-90">
          Crafted for those who live in rhythm.
        </p>

        <div className="relative w-[240px]">
          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="relative z-10 w-full py-3 rounded-full bg-white text-black font-semibold text-base md:text-lg overflow-hidden transition-all duration-300 ease-in-out active:scale-[0.98]"
          >
            {/* Purple fill overlay */}
            <div
              className="absolute top-0 left-0 h-full z-0 rounded-full transition-all duration-75 ease-linear"
              style={{
                width: `${fillProgress}%`,
                background: 'linear-gradient(90deg, #a855f7, #9333ea)',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)',
              }}
            />

            {/* Button content container */}
            <div className="relative z-10 flex items-center justify-center transition-all duration-300 ease-in-out">
              {!showCheckmark ? (
                <span
                  className={`transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Join the Vibe
                </span>
              ) : (
                <Check
                  size={22}
                  className="text-white transition-all duration-300 transform scale-100"
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}