import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Clock, Music, Heart } from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16 font-sans">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Animated Gradient Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-black text-center bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 bg-clip-text text-transparent tracking-tight"
        >
          Your Music Journey
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 p-6 shadow-xl hover:shadow-purple-700/20 transition duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white/10 p-3 rounded-full">
                  <card.icon className="w-7 h-7 text-purple-400" />
                </div>
                <p className="text-gray-400 text-sm">{card.label}</p>
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Circular Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 p-8 rounded-3xl shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-10 text-center text-indigo-300">
            Top Artists This Month
          </h2>
          <div className="flex justify-center items-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                barSize={20}
                data={stats.topArtists.map((a, i) => ({
                  name: a.name,
                  plays: a.plays,
                  fill: colors[i % colors.length]
                }))}
              >
                <PolarAngleAxis type="number" domain={[0, 400]} angleAxisId={0} tick={false} />
                <RadialBar background clockWise dataKey="plays" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#222',
                    borderRadius: 10,
                    border: 'none',
                    color: '#fff'
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-300">
            {stats.topArtists.map((artist, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                {artist.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}