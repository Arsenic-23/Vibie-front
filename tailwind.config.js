/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#7C3AED',
        secondary: '#6366F1',
      },
      animation: {
        spinSlow: 'spinSlow 20s linear infinite',
        popupIsland: 'popupIsland 0.3s ease-out forwards',
      },
      keyframes: {
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        popupIsland: {
          '0%': { transform: 'translate(-50%, 20%) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0%) scale(1)', opacity: '1' },
        },
      },
      perspective: {
        1000: '1000px',
      },
    },
  },
  plugins: [],
}