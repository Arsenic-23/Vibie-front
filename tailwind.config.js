/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
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
        spinSlow: 'spinSlow 2s linear infinite',
        pop: 'pop 0.3s ease-in-out',
        fadeInOut: 'fadeInOut 1.5s ease-in-out',
        fadeBounce: 'fadeBounce 1.5s ease-in-out',
      },
      keyframes: {
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pop: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.4)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        fadeInOut: {
          '0%': { opacity: 0, transform: 'scale(0.95) translateY(-10px)' },
          '30%': { opacity: 1, transform: 'scale(1) translateY(0)' },
          '70%': { opacity: 1, transform: 'scale(1) translateY(0)' },
          '100%': { opacity: 0, transform: 'scale(0.95) translateY(-10px)' },
        },
        fadeBounce: {
          '0%': { opacity: 0, transform: 'scale(0.8) translateY(-10px)' },
          '30%': { opacity: 1, transform: 'scale(1.05) translateY(0)' },
          '60%': { transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.9) translateY(-10px)' },
        },
      },
      perspective: {
        1000: '1000px',
      },
    },
  },
  plugins: [],
};