// src/context/AudioProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const AudioContext = createContext(null);

export const useAudioContext = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider');
  return ctx;
};

/**
 * AudioProvider responsibilities:
 * - Fetch audio URL from: /audio/audio/fetch?video_id=<id>
 * - Manage HTMLAudioElement lifecycle and events
 * - Expose actions: playTrack, addToQueue, togglePlay, seekTo, playNext, removeFromQueue, clearQueue
 * - Persist queue/currentTrack to localStorage
 * - Expose a small `toast` state so UI can show brief messages (e.g., "Added to queue")
 *
 * Song object shape is flexible but must include an identifier:
 * { id, videoId, song_id, video_id, title, thumbnail, channel, artist, duration }
 */

const LOCAL_QUEUE_KEY = 'vibie_queue_v1';
const LOCAL_CURRENT_KEY = 'vibie_current_v1';

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null); // includes audioUrl when loaded
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds
  const [queue, setQueue] = useState([]);
  const [toast, setToast] = useState(null); // { message, visible }
  const toastTimerRef = useRef(null);

  // Helper: robustly extract a video id from different possible key names
  const getVideoId = (song) => {
    if (!song) return null;
    return (
      song.videoId ||
      song.video_id ||
      song.id ||
      song.song_id ||
      song.youtubeId ||
      song.ytId ||
      null
    );
  };

  // Show a short toast (in-provider); UI can read toast from context
  const showToast = (message, ms = 1600) => {
    clearTimeout(toastTimerRef.current);
    setToast({ message, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => (t ? { ...t, visible: false } : null));
    }, ms);
  };

  // Fetch audio url using endpoint (flexible response shapes)
  const fetchAudioUrl = async (videoId) => {
    if (!videoId) throw new Error('Missing video id for fetchAudioUrl');
    try {
      const res = await axios.get('https://document-perception-shaved-genesis.trycloudflare.com/audio/audio/fetch', {
        params: { video_id: videoId },
      });

      // Accept many potential shapes
      const audioUrl =
        res?.data?.audio_url ||
        res?.data?.url ||
        res?.data?.audioUrl ||
        res?.data?.data?.url ||
        res?.data?.data?.audio_url ||
        (typeof res?.data === 'string' ? res.data : null);

      if (!audioUrl) {
        console.warn('AudioProvider: no audio url in fetch response', res?.data);
        throw new Error('No audio URL returned from audio fetch endpoint');
      }

      return audioUrl;
    } catch (err) {
      console.error('AudioProvider.fetchAudioUrl error', err);
      throw err;
    }
  };

  // Initialize HTMLAudioElement once
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();

    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime || 0);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    // when a song ends -> auto play next from queue
    const onEnded = () => {
      handlePlayNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      // don't null out audioRef here — app might remount provider
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist queue and currentTrack to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.warn('AudioProvider: failed saving queue', err);
    }
  }, [queue]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CURRENT_KEY, JSON.stringify(currentTrack));
    } catch (err) {
      console.warn('AudioProvider: failed saving current track', err);
    }
  }, [currentTrack]);

  // Restore persisted state on mount
  useEffect(() => {
    try {
      const savedQueue = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      const savedCurrent = JSON.parse(localStorage.getItem(LOCAL_CURRENT_KEY) || 'null');

      if (Array.isArray(savedQueue) && savedQueue.length) setQueue(savedQueue);
      if (savedCurrent) {
        // Don't auto-play on reload (respect browser policies).
        // But restore metadata (and optionally preload audio src).
        setCurrentTrack(savedCurrent);
        // if savedCurrent.audioUrl exists, set audio src but don't play automatically
        if (savedCurrent.audioUrl) {
          const audio = audioRef.current;
          try {
            audio.src = savedCurrent.audioUrl;
            audio.crossOrigin = 'anonymous';
            audio.load();
            setDuration(audio.duration || 0);
          } catch (err) {
            // ignore
          }
        }
      }
    } catch (err) {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Core: play a song (if another track is playing, add to queue instead)
  const playTrack = async (song) => {
    if (!song) return;
    // If there's a playing track already, add to queue per requirement
    if (isPlaying && currentTrack) {
      addToQueue(song);
      showToast('Added to queue');
      return;
    }

    const vid = getVideoId(song);
    if (!vid) {
      console.warn('AudioProvider.playTrack: missing video id on song', song);
      return;
    }

    try {
      const audioUrl = await fetchAudioUrl(vid);
      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.crossOrigin = 'anonymous';
      audio.load();

      // update currentTrack with audioUrl included
      setCurrentTrack({
        ...song,
        audioUrl,
      });

      // try to play (may be blocked by autoplay policies)
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Play blocked by browser — keep the src loaded and leave isPlaying false.
        setIsPlaying(false);
        console.warn('AudioProvider.playTrack: autoplay blocked or failed', err);
      }
    } catch (err) {
      showToast('Playback failed');
      console.error('AudioProvider.playTrack error', err);
    }
  };

  // If you want to force playing immediately even if something playing, you can implement
  // playNow which clears current and overrides queue — not required by you now.

  // Add to queue (push at end)
  const addToQueue = (song) => {
    if (!song) return;
    setQueue((prev) => {
      const next = [...prev, song];
      return next;
    });
    showToast('Added to queue');
  };

  // Remove from queue by id (tries multiple id keys)
  const removeFromQueue = (identifier) => {
    setQueue((prev) =>
      prev.filter((s) => {
        // Accept string ids or objects
        const ids = [s.id, s.song_id, s.videoId, s.video_id, s.songId].map(String);
        return !ids.includes(String(identifier));
      })
    );
  };

  // Clear whole queue
  const clearQueue = () => {
    setQueue([]);
  };

  // Seek to seconds
  const seekTo = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
  };

  // Toggle play/pause
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('AudioProvider.togglePlay: play failed', err);
      }
    }
  };

  // Play next from queue (internal). If queue empty, stops playback.
  const handlePlayNext = async () => {
    // get next
    if (!queue || queue.length === 0) {
      // nothing next -> stop and clear current
      const audio = audioRef.current;
      audio.pause();
      setIsPlaying(false);
      setCurrentTrack(null);
      setProgress(0);
      setDuration(0);
      return;
    }

    const [next, ...rest] = queue;
    setQueue(rest);

    // fetch audio url for the next track and play
    try {
      const vid = getVideoId(next);
      if (!vid) {
        // skip malformed and continue
        handlePlayNext();
        return;
      }
      const audioUrl = await fetchAudioUrl(vid);
      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.crossOrigin = 'anonymous';
      audio.load();
      setCurrentTrack({ ...next, audioUrl });
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // if play fails (autoplay), keep it loaded and set isPlaying false
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('AudioProvider.handlePlayNext error', err);
      // try next if failed
      handlePlayNext();
    }
  };

  // Expose a programmatic next (alias)
  const playNext = () => {
    handlePlayNext();
  };

  // Expose setter for queue if needed
  const replaceQueue = (newQueue) => {
    setQueue(Array.isArray(newQueue) ? newQueue : []);
  };

  const value = {
    audioRef, // ref to the HTMLAudioElement
    currentTrack,
    isPlaying,
    progress,
    duration,
    queue,
    playTrack,
    addToQueue,
    togglePlay,
    seekTo,
    playNext,
    removeFromQueue,
    clearQueue,
    replaceQueue,
    setCurrentTrack,
    toast,
    showToast,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
