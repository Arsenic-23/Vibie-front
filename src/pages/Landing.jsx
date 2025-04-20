import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Force Telegram Mini App to init
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
  }, []);

  const handleJoin = () => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();

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

    localStorage.setItem('authToken', 'mock-token'); // Just a mock token for your frontend
    localStorage.setItem('profile', JSON.stringify(userData));

    const queryParams = new URLSearchParams(window.location.search);
    const joinId = queryParams.get('join');

    setIsLoading(true);
    setTimeout(() => {
      navigate(joinId ? `/home?join=${joinId}` : '/home');
    }, 200); // small delay for effect
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/bg.jpg)' }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-0" />

      <div className="z-20 pt-14 flex items-center gap-2">
        <PlayCircle size={22} className="text-white" />
        <span className="text-white text-base font-bold tracking-wide drop-shadow-md">Vibie</span>
      </div>

      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center px-6 tracking-tight leading-snug drop-shadow-xl">
          Over 100 million songs<br />and counting
        </h1>
      </div>

      <div className="z-20 pb-12 flex flex-col items-center gap-2">
        <p className="text-white text-sm md:text-base font-light opacity-90">
          Crafted for those who live in rhythm.
        </p>
        <button
          onClick={handleJoin}
          className="bg-white text-black font-medium rounded-full px-20 py-3 text-base md:text-lg shadow-xl transition-transform duration-150 ease-out active:scale-95 motion-safe:active:animate-tapShrink"
          disabled={isLoading}
        >
          {isLoading ? 'Joining...' : 'Join the Vibe'}
        </button>
      </div>
    </div>
  );
}