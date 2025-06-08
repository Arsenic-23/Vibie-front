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

const cards = [
  {
    icon: Music,
    label: 'Total Songs',
    value: stats.totalSongs.toLocaleString()
  },
  {
    icon: Clock,
    label: 'Listening Time',
    value: `${(stats.totalMinutes / 60).toFixed(1)} hrs`
  },
  {
    icon: Heart,
    label: 'Favorite Genre',
    value: stats.favoriteGenre
  },
  {
    icon: Headphones,
    label: 'Top Artists',
    value: stats.topArtists.length
  }
];

export default function Statistics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-primary"
        >
          Your Listening Insights
        </motion.h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/30 p-2 rounded-full">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{card.label}</p>
                  <p className="text-lg font-semibold text-white">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Artists Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-primary">Top Artists</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.topArtists} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fill: 'white', fontSize: 14 }}
              />
              <Tooltip
                cursor={{ fill: '#ffffff11' }}
                contentStyle={{
                  backgroundColor: '#111',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#facc15' }}
              />
              <Bar
                dataKey="plays"
                fill="#facc15"
                barSize={20}
                radius={[10, 10, 10, 10]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}