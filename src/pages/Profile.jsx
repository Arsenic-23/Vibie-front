mport React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { History, BarChart2, Heart, Settings, PlayCircle } from 'lucide-react';
import { getFirebaseUser } from '../utils/auth'; // <-- helper we expect in your project

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadUser() {
      // Prefer client-side Firebase user (fast). If not available, try Telegram WebApp user.
      try {
        const fbUser = await getFirebaseUser();
        if (fbUser) {
          setUser({
            user_id: fbUser.uid || fbUser.id,
            name: fbUser.displayName || fbUser.name,
            username: fbUser.username || fbUser.email?.split('@')[0],
            profile_pic: fbUser.photoURL || fbUser.picture,
            email: fbUser.email,
          });
          return;
        }
      } catch (e) {
        // ignore and fallback
      }

      // fallback to Telegram WebApp user if present
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (tgUser) {
        setUser({
          user_id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          username: tgUser.username,
          profile_pic: tgUser.photo_url,
        });
      }
    }

    loadUser();
  }, []);

  const tabs = [
    { to: '/profile/history', icon: History, color: 'bg-blue-500', label: 'History' },
    { to: '/profile/statistics', icon: BarChart2, color: 'bg-green-500', label: 'Statistics' },
    { to: '/profile/favourites', icon: Heart, color: 'bg-pink-500', label: 'Favourites' },
    { to: '/profile/settings', icon: Settings, color: 'bg-purple-500', label: 'Settings' },
  ];

  const Tab = ({ to, Icon, color, label }) => {
    const isActive = location.pathname === to;
    return (
      <div onClick={() => navigate(to)} className={`flex items-center gap-4 w-full px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${isActive ? 'bg-white text-black dark:bg-[#2e2e40] dark:text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#1f1f2e] dark:text-gray-300 hover:dark:bg-[#2e2e3e]'} select-none`} role="button">
        <div className={`w-9 h-9 flex items-center justify-center rounded-md ${color} text-white`}><Icon size={18} /></div>
        {label}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center text-black dark:text-white select-none">
      <div className="mb-8 w-full text-left"><h1 className="text-3xl font-bold tracking-wide">Viber</h1></div>

      <div className="mt-2 w-full flex items-center gap-5 rounded-2xl p-5 shadow-lg mb-10 bg-white dark:bg-[#1e1e2f] select-none">
        <div className="relative w-24 h-24 shrink-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-md opacity-50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center animate-spinSlow"><div className="w-full h-full rounded-full p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" /></div>
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-[92%] h-[92%] rounded-full overflow-hidden bg-gray-100 dark:bg-black">
            <img src={user?.profile_pic || 'https://placehold.co/150x150'} alt="Profile" className="w-full h-full object-cover rounded-full" />
          </div></div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{user?.name || 'Viber'}</h2>
          <p className="text-gray-600 dark:text-violet-400 text-sm">{user?.username ? `@${user.username}` : 'Welcome back!'}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 px-2 mt-6 mb-6">{tabs.map(({ to, icon: Icon, color, label }) => (<Tab key={to} to={to} Icon={Icon} color={color} label={label}/>))}</div>

      <div className="w-full px-2"><Outlet /></div>

      <div className="mt-10 flex justify-center items-center text-sm text-gray-400 dark:text-gray-500"><PlayCircle size={18} className="text-purple-500 mr-2" /><span className="font-semibold text-base tracking-wide">Vibie</span></div>
    </div>
  );
}
