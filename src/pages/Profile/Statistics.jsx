import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Headphones, Clock, Music, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = {
  totalSongs: 1234,
  totalMinutes: 21000,
  favoriteGenre: 'Lo-fi',
  topArtists: [
    { name: 'Chillhop', plays: 320 },
    { name: 'Nujabes', plays: 290 },
    { name: 'Lofi Girl', plays: 245 }
  ]
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
};

export default function Statistics() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">
      <h3 className="text-3xl font-extrabold text-center text-yellow-500 dark:text-yellow-400">Your Music Stats</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[{
          icon: <Music className="w-8 h-8 text-yellow-400" />,
          label: 'Total Songs Played',
          value: stats.totalSongs.toLocaleString()
        }, {
          icon: <Clock className="w-8 h-8 text-yellow-400" />,
          label: 'Total Time Listened',
          value: `${(stats.totalMinutes / 60).toFixed(1)} hrs`
        }, {
          icon: <Heart className="w-8 h-8 text-yellow-400" />,
          label: 'Favourite Genre',
          value: stats.favoriteGenre
        }, {
          icon: <Headphones className="w-8 h-8 text-yellow-400" />,
          label: 'Unique Artists',
          value: stats.topArtists.length
        }].map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl shadow-md flex items-center gap-4 transition hover:shadow-lg"
          >
            <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-md">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top Artists Played</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats.topArtists} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fill: 'currentColor', fontSize: 14 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff' }}
              itemStyle={{ color: '#facc15' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="plays" fill="#facc15" radius={[10, 10, 10, 10]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}