import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export default function Landing({ setIsLandingPage }) {
  const navigate = useNavigate();
  const [checkingUser, setCheckingUser] = useState(true);

  const handleJoin = () => {
    window.navigator.vibrate?.([70, 100, 70]);
    setIsLandingPage(false);
    navigate('/home');
  };

  useEffect(() => {
    const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!tgUser) {
      window.location.href = 'https://t.me/vibie_bot';
      return;
    }

    const userData = {
      telegram_id: tgUser.id,
      name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim(),
      username: tgUser.username || '',
      photo_url: tgUser.photo_url || '', // fallback if available in WebApp
    };

    // Register or update the user
    fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => {
        // Fetch full profile to check photo_url
        fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tgUser.id}` // Or use token if available
          }
        })
          .then(res => {
            if (!res.ok) throw new Error('Profile fetch failed');
            return res.json();
          })
          .then(profile => {
            if (!profile.photo_url) {
              // If profile photo missing, redirect to bot to complete
              window.location.href = 'https://t.me/vibie_bot';
            } else {
              setCheckingUser(false);
            }
          })
          .catch(err => {
            console.error('Profile error:', err);
            window.location.href = 'https://t.me/vibie_bot';
          });
      })
      .catch(err => {
        console.error('Registration error:', err);
        window.location.href = 'https://t.me/vibie_bot';
      });
  }, []);

  if (checkingUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white text-lg">
        Checking your account...
      </div>
    );
  }

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
        >
          Join the Vibe
        </button>
      </div>
    </div>
  );
}