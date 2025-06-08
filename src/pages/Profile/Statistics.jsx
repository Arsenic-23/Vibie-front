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
    label: 'Songs',
    value: stats.totalSongs.toLocaleString()
  },
  {
    icon: Clock,
    label: 'Time',
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
    <div className="min-h-screen px-6 py-12 bg-gray-100 text-gray-800 dark:bg-[#0f0f11] dark:text-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Monthly Music Snapshot</h1>

        {/* Capsule Cards */}
        <div className="flex flex-wrap gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white text-gray-800 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 shadow-sm"
            >
              <card.icon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">{card.label}:</span>
              <span className="text-sm font-semibold">{card.value}</span>
            </div>
          ))}
        </div>

        {/* Radial Chart */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-sm">
          <h2 className="text-base font-semibold mb-6 text-center text-indigo-500 dark:text-indigo-300">
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
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600 dark:text-gray-300">
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