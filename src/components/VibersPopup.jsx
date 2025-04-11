import React from 'react';

export default function VibersPopup({ onClose }) {
  const vibers = [
    { name: 'Alice', pic: 'https://placehold.co/48x48?text=A' },
    { name: 'Bob', pic: 'https://placehold.co/48x48?text=B' },
    { name: 'Cara', pic: 'https://placehold.co/48x48?text=C' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Floating Panel */}
      <div className="relative z-50 w-72 bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-5 mt-20 ml-2 animate-slideInSmall">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Vibers</h3>
        <ul className="space-y-4">
          {vibers.map((viber, index) => (
            <li key={index} className="flex items-center space-x-4">
              <img
                src={viber.pic}
                alt={viber.name}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow"
              />
              <span className="text-base font-medium text-black dark:text-white">
                {viber.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slideInSmall {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInSmall {
          animation: slideInSmall 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}