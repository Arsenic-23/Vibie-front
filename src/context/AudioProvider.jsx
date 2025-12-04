// src/context/AudioProvider.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AudioContext = createContext({});
export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();

    const handleEnded = () => playNext();
    audioRef.current.addEventListener('ended', handleEnded);

    return () => audioRef.current.removeEventListener('ended', handleEnded);
  }, []);

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying, currentSong]);

  // Get audio URL from backend
  const fetchAudioUrl = async (videoId) => {
    const res = await axios.get(`${backendUrl}/audio/audio/fetch`, {
      params: { video_id: videoId },
    });

    return res.data.audioUrl;
  };

  const playSong = async (song) => {
    if (!song) {
      setIsPlaying(false);
      audioRef.current.pause();
      return;
    }

    if (!song.audio_url) {
      const url = await fetchAudioUrl(song.song_id);
      song.audio_url = url;
    }

    setCurrentSong(song);
    audioRef.current.src = song.audio_url;
    setIsPlaying(true);
  };

  const addToQueue = (song) => {
    setQueue((prev) => [...prev, song]);
  };

  const removeFromQueue = (songId) => {
    setQueue((prev) => prev.filter((s) => s.song_id !== songId));
  };

  const playNext = async () => {
    if (queue.length === 0) {
      setCurrentSong(null);
      setIsPlaying(false);
      return;
    }

    const nextSong = queue[0];
    setQueue((prev) => prev.slice(1));

    if (!nextSong.audio_url) {
      nextSong.audio_url = await fetchAudioUrl(nextSong.song_id);
    }

    setCurrentSong(nextSong);
    audioRef.current.src = nextSong.audio_url;
    setIsPlaying(true);
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        setIsPlaying,
        playSong,
        addToQueue,
        removeFromQueue,
        playNext,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
