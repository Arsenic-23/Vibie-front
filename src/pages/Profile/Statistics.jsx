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
    label: 'Songs',
    value: stats.totalSongs.toLocaleString()
  },
  {
    icon: Clock,
    label: 'Minutes',
    value: `${(stats.totalMinutes / 60).toFixed(1)}h`
  },
  {
    icon: Heart,
    label: 'Genre',
    value: stats.favoriteGenre
  },
  {
    icon: Headphones,
    label: 'Artists',
    value: stats.topArtists.length
  }
];

const colors = ['#A78BFA', '#60A5FA', '#34D399'];

export default function Statistics() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-gray-950 text-white px-6 py-16 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Clean Title */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-white/90">
          Your Monthly Music Snapshot
        </h1>

        {/* Minimal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {cards.map((card, index) => (
            <div
              key={card.label}
              className="rounded-xl bg-white/5 p-4 shadow-md backdrop-blur-sm border border-white/10 flex flex-col items-center gap-2"
            >
              <div className="bg-white/10 p-2 rounded-full">
                <card.icon className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Radial Chart for Top Artists */}
        <div className="bg-white/5 p-6 rounded-3xl shadow-lg border border-white/10">
          <h2 className="text-xl font-medium mb-6 text-center text-indigo-300">
            Top Artists
          </h2>
          <div className="flex justify-center items-center h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="100%"
                barSize={15}
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
                    backgroundColor: '#1f1f1f',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff'
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-300">
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
        </div>
      </div>
    </div>
  );
}