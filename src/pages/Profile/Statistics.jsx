import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
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

const colors = ['#A78BFA', '#60A5FA', '#34D399'];

export default function Statistics() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-950 via-black to-gray-900 text-white px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        >
          Music Vibes Report
        </motion.h1>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="bg-primary/30 p-3 rounded-full">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p className="text-xl font-bold text-white">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-secondary">Top Artists This Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topArtists} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fill: 'white', fontSize: 16 }}
              />
              <Tooltip
                cursor={{ fill: '#ffffff11' }}
                contentStyle={{ backgroundColor: '#222', borderRadius: 10, border: 'none', color: '#fff' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="plays" radius={[10, 10, 10, 10]}>
                {stats.topArtists.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
