import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const song = queue[currentIndex] ?? null;

    if (song) {
      setCurrentSong(song);
      if (audio.src !== song.url) {
        audio.src = song.url;
      }
      if (isPlaying) {
        audio.play().catch((e) => {
          console.warn('Playback failed:', e);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
      setCurrentSong(null);
      setIsPlaying(false);
    }
  }, [currentIndex, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setCurrentIndex((prev) => {
        if (prev + 1 < queue.length) {
          return prev + 1;
        }
        setIsPlaying(false);
        return prev;
      });
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [queue.length]);

  const playSong = (song) => {
    if (!song || !song.url) {
      console.warn('playSong called with invalid song:', song);
      return;
    }

    setQueue((prev) => {
      const idx = prev.findIndex((s) => s.song_id === song.song_id);
      if (idx !== -1) {
        setTimeout(() => setCurrentIndex(idx), 0);
        return prev;
      }
      const next = [...prev, song];
      setTimeout(() => setCurrentIndex(next.length - 1), 0);
      return next;
    });

    setIsPlaying(true);
  };

  const addToQueue = (song) => {
    if (!song) return;
    setQueue((prev) => {
      if (prev.some((s) => s.song_id === song.song_id)) return prev;
      return [...prev, song];
    });
  };

  const removeFromQueue = (songId) => {
    setQueue((prev) => {
      const idx = prev.findIndex((s) => s.song_id === songId);
      if (idx === -1) return prev;

      const newQueue = prev.filter((s) => s.song_id !== songId);

      setCurrentIndex((cur) => {
        if (idx < cur) {
          return Math.max(0, cur - 1);
        } else if (idx === cur) {
          if (idx < newQueue.length) {
            return idx;
          } else if (newQueue.length > 0) {
            return newQueue.length - 1;
          } else {
            return -1;
          }
        }
        return cur;
      });

      return newQueue;
    });
  };

  const pause = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    const audio = audioRef.current;
    audio.play().catch((e) => {
      console.warn('Playback resume failed:', e);
    });
    setIsPlaying(true);
  };

  const togglePlay = () => {
    isPlaying ? pause() : resume();
  };

  const next = () => {
    setCurrentIndex((prev) => {
      if (prev + 1 < queue.length) {
        return prev + 1;
      }
      return prev;
    });
  };

  const prev = () => {
    setCurrentIndex((prev) => {
      if (prev - 1 >= 0) return prev - 1;
      return prev;
    });
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
        next,
        prev,
        setCurrentIndex,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};