// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { getFirebaseUser } from "../utils/auth";
import { useRealtime } from "../context/RealtimeContext";
import { History, BarChart2, Heart, Settings, PlayCircle } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const { sendProfileUpdate } = useRealtime();
  const navigate = useNavigate();
  const location = useLocation();

  // LOAD USER (Firebase or cache)
  useEffect(() => {
    async function load() {
      const fb = await getFirebaseUser().catch(() => null);

      if (fb) {
        const profile = {
          user_id: fb.uid,
          name: fb.displayName,
          username: fb.email ? fb.email.split("@")[0] : undefined,
          profile_pic: fb.photoURL,
        };
        setUser(profile);

        localStorage.setItem(
          "profile",
          JSON.stringify({
            uid: fb.uid,
            name: fb.displayName,
            username: profile.username,
            photo: fb.photoURL,
          })
        );
      } else {
        const cached = JSON.parse(localStorage.getItem("profile") || "null");
        if (cached)
          setUser({
            user_id: cached.uid,
            name: cached.name,
            username: cached.username,
            profile_pic: cached.photo,
          });
      }
    }
    load();
  }, []);

  async function handleEditName(newName) {
    const updated = { ...user, name: newName };
    setUser(updated);

    await sendProfileUpdate({
      name: newName,
      username: user.username,
      profile_pic: user.profile_pic,
    });

    localStorage.setItem(
      "profile",
      JSON.stringify({
        uid: user.user_id,
        name: newName,
        username: user.username,
        photo: user.profile_pic,
      })
    );
  }

  // UI TABS (same as your sample design)
  const tabs = [
    { to: "/profile/history", icon: History, color: "bg-blue-500", label: "History" },
    { to: "/profile/statistics", icon: BarChart2, color: "bg-green-500", label: "Statistics" },
    { to: "/profile/favourites", icon: Heart, color: "bg-pink-500", label: "Favourites" },
    { to: "/profile/settings", icon: Settings, color: "bg-purple-500", label: "Settings" },
  ];

  const Tab = ({ to, icon: Icon, color, label }) => {
    const active = location.pathname === to;

    return (
      <div
        onClick={() => navigate(to)}
        className={`flex items-center gap-4 w-full px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200
          ${
            active
              ? "bg-white text-black dark:bg-[#2e2e40] dark:text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#1f1f2e] dark:text-gray-300 hover:dark:bg-[#2e2e3e]"
          }`}
      >
        <div className={`w-9 h-9 flex items-center justify-center rounded-md ${color} text-white`}>
          <Icon size={18} />
        </div>
        {label}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center text-black dark:text-white select-none">

      {/* PAGE TITLE */}
      <div className="mb-8 w-full text-left">
        <h1 className="text-3xl font-bold tracking-wide">Viber</h1>
      </div>

      {/* PROFILE HEADER CARD */}
      <div className="mt-2 w-full flex items-center gap-5 rounded-2xl p-5 shadow-lg mb-10 bg-white dark:bg-[#1e1e2f]">

        {/* PROFILE PICTURE ANIMATED RING */}
        <div className="relative w-24 h-24 shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-md opacity-50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center animate-spinSlow">
            <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[92%] h-[92%] rounded-full overflow-hidden bg-gray-100 dark:bg-black">
              <img
                src={user?.profile_pic || "https://placehold.co/150x150"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* USER NAME + USERNAME */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{user?.name || "Viber"}</h2>
          <p className="text-gray-600 dark:text-violet-400 text-sm">
            {user?.username ? `@${user.username}` : "Welcome back!"}
          </p>

          {/* Name input below username */}
          <input
            defaultValue={user?.name || ""}
            className="mt-3 px-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-[#2e2e40]"
            onBlur={(e) => handleEditName(e.target.value)}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="w-full flex flex-col gap-4 px-2 mt-6 mb-6">
        {tabs.map((tab) => (
          <Tab key={tab.to} {...tab} />
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="w-full px-2">
        <Outlet />
      </div>

      {/* FOOTER */}
      <div className="mt-10 flex justify-center items-center text-sm text-gray-400 dark:text-gray-500">
        <PlayCircle size={18} className="text-purple-500 mr-2" />
        <span className="font-semibold text-base tracking-wide">Vibie</span>
      </div>
    </div>
  );
}
