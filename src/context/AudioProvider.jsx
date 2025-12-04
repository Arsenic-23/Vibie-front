// src/context/AudioProvider.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AudioContext = createContext({});
export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* Initialize */
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const loaded = () => setDuration(audio.duration);
    const ended = () => playNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("ended", ended);
    };
  }, []);

  /* Sync play/pause */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  /* Fetch audio URL */
  const fetchAudioUrl = async (videoId) => {
    const res = await axios.get(`${backendUrl}/audio/audio/fetch`, {
      params: { video_id: videoId },
    });
    return res.data.audioUrl;
  };

  /* Play a song */
  const playSong = async (song) => {
    if (!song) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (!song.audio_url) {
      song.audio_url = await fetchAudioUrl(song.song_id);
    }

    setCurrentSong(song);
    audioRef.current.src = song.audio_url;
    setIsPlaying(true);
  };

  /* Queue handling */
  const addToQueue = (song) => setQueue((prev) => [...prev, song]);
  const removeFromQueue = (songId) => setQueue((prev) => prev.filter((s) => s.song_id !== songId));

  /* Play next */
  const playNext = async () => {
    if (queue.length === 0) {
      setCurrentSong(null);
      setIsPlaying(false);
      return;
    }

    const next = queue[0];
    setQueue((prev) => prev.slice(1));

    if (!next.audio_url) next.audio_url = await fetchAudioUrl(next.song_id);

    setCurrentSong(next);
    audioRef.current.src = next.audio_url;
    setIsPlaying(true);
  };

  /* Seek */
  const seekTo = (percent) => {
    if (!audioRef.current || !duration) return;
    const newTime = (percent / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
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

        currentTime,
        duration,
        seekTo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
