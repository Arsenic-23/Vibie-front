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

  // Initialize Audio element
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleEnded = async () => {
      // Play next song in queue
      await playNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // Play/Pause effect
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    else audioRef.current.pause();
  }, [isPlaying, currentSong]);

  const fetchAudioUrl = async (videoId) => {
    const res = await axios.get(`${backendUrl}/audio/fetch`, { params: { video_id: videoId } });
    return res.data.audioUrl;
  };

  const playSong = async (song) => {
    if (!song.audio_url) {
      const url = await fetchAudioUrl(song.song_id);
      song.audio_url = url;
    }
    setCurrentSong(song);
    audioRef.current.src = song.audio_url;
    setIsPlaying(true);
  };

  const addToQueue = async (song) => {
    // Add song to backend queue
    await axios.post(`${backendUrl}/queue/add`, song);
    setQueue((prev) => [...prev, song]);
  };

  const removeFromQueue = async (songId) => {
    setQueue((prev) => prev.filter((s) => s.song_id !== songId));
    // TODO: call backend to remove if needed
  };

  const playNext = async () => {
    if (queue.length === 0) {
      setCurrentSong(null);
      setIsPlaying(false);
      return;
    }

    const nextSong = queue[0];
    setQueue((prev) => prev.slice(1));

    if (!nextSong.audio_url) nextSong.audio_url = await fetchAudioUrl(nextSong.song_id);

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
        addToQueue,
        removeFromQueue,
        playSong,
        playNext,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
