import React from 'react';

export default function VibersPopup() {
  const vibers = [
    { name: 'Alice', pic: 'https://placehold.co/32x32?text=A' },
    { name: 'Bob', pic: 'https://placehold.co/32x32?text=B' },
    { name: 'Cara', pic: 'https://placehold.co/32x32?text=C' },
  ];

  return (
    <div className="backdrop-blur-lg bg-white/80 dark:bg-black/40 p-4 rounded-xl shadow-xl w-64">
      <h3 className="text-lg font-semibold mb-3">Vibers</h3>
      <ul className="space-y-3">
        {vibers.map((viber, index) => (
          <li key={index} className="flex items-center space-x-3">
            <img
              src={viber.pic}
              alt={viber.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{viber.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}