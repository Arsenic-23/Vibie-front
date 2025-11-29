import React from "react";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Landing() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const profile = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        uid: user.uid,
      };

      localStorage.setItem("profile", JSON.stringify(profile));
      navigate("/stream");
    } catch (error) {
      console.error("Google Login Error", error);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-cover bg-center"
      style={{ backgroundImage: "url(/images/bg.jpg)" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      <div className="z-20 pt-14 flex items-center gap-2">
        <PlayCircle size={22} className="text-purple-400 drop-shadow-lg" />
        <span className="text-white text-base font-bold tracking-wide drop-shadow-md">
          Vibie
        </span>
      </div>

      <div className="z-10 flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-4xl font-semibold mb-4 text-center px-6 tracking-tight leading-snug drop-shadow-xl">
          Over 100 million songs
          <br />
          and counting
        </h1>
      </div>

      <div className="z-20 pb-16 flex flex-col items-center gap-4">

        {/* Google Gradient Button */}
        <button
          onClick={handleGoogleLogin}
          className="
            relative flex items-center justify-center gap-3 
            w-[260px] py-3 rounded-full font-semibold text-white text-base
            bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]
            bg-[length:300%_300%] animate-gradientFlow
            shadow-xl hover:shadow-2xl 
            hover:scale-[1.03] active:scale-[0.98]
            transition-all duration-300
          "
        >
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
            alt="google"
            className="w-6 h-6 bg-white rounded-full p-1 shadow-sm"
          />
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
