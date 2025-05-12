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

export default function Statistics() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">Your Statistics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Songs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4"
        >
          <Music className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />
          <div>
            <p className="text-gray-700 dark:text-gray-300">Total Songs Played</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.totalSongs.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Total Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4"
        >
          <Clock className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />
          <div>
            <p className="text-gray-700 dark:text-gray-300">Total Time Listened</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {(stats.totalMinutes / 60).toFixed(1)} hrs ({stats.totalMinutes.toLocaleString()} mins)
            </p>
          </div>
        </motion.div>

        {/* Genre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4"
        >
          <Heart className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />
          <div>
            <p className="text-gray-700 dark:text-gray-300">Favourite Genre</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.favoriteGenre}</p>
          </div>
        </motion.div>

        {/* Total Artists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4"
        >
          <Headphones className="w-8 h-8 text-yellow-500 dark:text-yellow-300" />
          <div>
            <p className="text-gray-700 dark:text-gray-300">Unique Artists</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{stats.topArtists.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Top Artists Played</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topArtists} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'currentColor' }} />
            <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', borderColor: '#444' }} />
            <Bar dataKey="plays" fill="#facc15" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}