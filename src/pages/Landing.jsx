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

  const handleJoin = async () => {
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

    const queryParams = new URLSearchParams(window.location.search);
    const joinId = queryParams.get('join');
    const stream_id = joinId || user.id.toString();

    const userData = {
      telegram_id: user.id,
      name: user.first_name,
      username: user.username,
      profile_pic: user.photo_url || '',
      stream_id: stream_id,
    };

    try {
      setIsLoading(true);
      setFillProgress(0);
      setShowCheckmark(false);

      const res = await fetch(`https://your-backend-url/users/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      localStorage.setItem('stream_id', data.stream_id);
      localStorage.setItem('user_id', user.id.toString());
      localStorage.setItem('profile', JSON.stringify(userData));

      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setFillProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setShowCheckmark(true);
          setTimeout(() => {
            navigate('/home');
          }, 600);
        }
      }, 16);
    } catch (err) {
      alert("Failed to join stream. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/bg.jpg)' }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-0" />
      <div className="z-20 pt-14 flex items-center gap-2">
        <PlayCircle size={22} className="text-purple-400 drop-shadow-lg" />
        <span className="text-white text-base font-bold tracking-wide drop-shadow-md">Vibie</span>
      </div>
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center px-6 tracking-tight leading-snug drop-shadow-xl">
          Over 100 million songs<br />and counting
        </h1>
      </div>
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
            <div
              className="absolute top-0 left-0 h-full rounded-full z-0"
              style={{
                width: `${fillProgress}%`,
                transition: 'width 0.15s linear',
                background: 'linear-gradient(90deg, #a855f7, #9333ea)',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)',
              }}
            />
            <div className="relative z-10 flex items-center justify-center transition-opacity duration-300">
              {!showCheckmark ? (
                <span className={`transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Join the Vibe
                </span>
              ) : (
                <Check size={22} className="text-white transition-transform duration-300 scale-100" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}