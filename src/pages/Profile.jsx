// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useRealtime } from "../context/RealtimeContext";
import { getFirebaseUser, loginWithGoogle } from "../utils/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const { sendProfileUpdate } = useRealtime();

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
        localStorage.setItem("profile", JSON.stringify({
          uid: fb.uid, name: fb.displayName, username: profile.username, photo: fb.photoURL
        }));
      } else {
        const cached = JSON.parse(localStorage.getItem("profile") || "null");
        if (cached) setUser({ user_id: cached.uid, name: cached.name, username: cached.username, profile_pic: cached.photo });
      }
    }
    load();
  }, []);

  async function handleEditName(newName) {
    const updated = { ...user, name: newName };
    setUser(updated);
    // update server via realtime
    await sendProfileUpdate({ name: newName, profile_pic: user.profile_pic, username: user.username });
    // update local storage
    localStorage.setItem("profile", JSON.stringify({ uid: user.user_id, name: newName, username: user.username, photo: user.profile_pic }));
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center gap-4">
        <img src={user?.profile_pic || 'https://placehold.co/150x150'} className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-xl font-bold">{user?.name || 'Viber'}</h2>
          <p className="text-sm text-gray-500">{user?.username ? `@${user.username}` : 'No username'}</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs text-gray-500">Display name</label>
        <input defaultValue={user?.name || ''} className="w-full p-2 border rounded mt-1"
               onBlur={(e) => handleEditName(e.target.value)} />
      </div>
    </div>
  );
}
