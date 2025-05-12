import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, BellOff, Globe } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'French', 'German'];

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Settings</h3>

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span>Theme: {darkMode ? 'Dark' : 'Light'}</span>
        </div>
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          className={`${darkMode ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
        >
          <span className="sr-only">Toggle Theme</span>
          <span
            className={`${
              darkMode ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </motion.div>

      {/* Notification Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          <span>Notifications: {notifications ? 'On' : 'Off'}</span>
        </div>
        <Switch
          checked={notifications}
          onChange={setNotifications}
          className={`${notifications ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
        >
          <span className="sr-only">Toggle Notifications</span>
          <span
            className={`${
              notifications ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </motion.div>

      {/* Language Selector */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-gray-700 dark:text-gray-300"
      >
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5" />
          <span className="font-medium">Language</span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full mt-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {languages.map((lang) => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
      </motion.div>
    </div>
  );
}