import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Headphones, Clock, Music, Heart } from 'lucide-react';

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
    value: `${(stats.totalMinutes / 60).toFixed(1)} hours`
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
    <div className="min-h-screen px-6 py-14 bg-neutral-950 text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <h1 className="text-4xl font-bold tracking-tight">Your Monthly Music Summary</h1>

        {/* Vertical Capsule Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col justify-center items-start h-40 hover:scale-[1.02] transition-transform"
            >
              <div className="bg-white/10 p-3 rounded-full mb-4">
                <card.icon className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-center text-indigo-400">
            Top Artists This Month
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