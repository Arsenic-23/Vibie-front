import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play a song immediately
  const playSong = (song) => {
    const index = queue.findIndex((s) => s.song_id === song.song_id);
    if (index === -1) {
      // Add to queue if not present
      setQueue((prev) => [...prev, song]);
      setCurrentIndex(queue.length);
    } else {
      setCurrentIndex(index);
    }
    setCurrentSong(song);
    audioRef.current.src = song.url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // Play next song automatically
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (currentIndex + 1 < queue.length) {
        setCurrentIndex(currentIndex + 1);
        const nextSong = queue[currentIndex + 1];
        setCurrentSong(nextSong);
        audio.src = nextSong.url;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentIndex, queue]);

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    isPlaying ? pause() : resume();
  };

  const addToQueue = (song) => {
    setQueue((prev) => [...prev, song]);
  };

  const removeFromQueue = (songId) => {
    setQueue((prev) => prev.filter((s) => s.song_id !== songId));
    if (currentSong?.song_id === songId) {
      // Play next song if current is removed
      const nextIndex = queue.findIndex((s) => s.song_id === songId) + 1;
      if (nextIndex < queue.length) {
        const nextSong = queue[nextIndex];
        playSong(nextSong);
      } else {
        audioRef.current.pause();
        setCurrentSong(null);
        setIsPlaying(false);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        queue,
        currentSong,
        currentIndex,
        isPlaying,
        playSong,
        pause,
        resume,
        togglePlay,
        addToQueue,
        removeFromQueue,
        setQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

// ✅ Hook to use audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
