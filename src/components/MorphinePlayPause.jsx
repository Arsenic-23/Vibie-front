import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const paths = {
  play: 'M6 4l20 12-20 12V4z',
  pause: 'M6 4h6v24H6V4zm12 0h6v24h-6V4z',
};

export default function MorphingPlayPause({ size = 32 }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { d } = useSpring({
    d: isPlaying ? paths.pause : paths.play,
    config: { tension: 200, friction: 20 },
  });

  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      className="w-16 h-16 rounded-full bg-white text-black shadow-xl flex items-center justify-center"
    >
      <svg viewBox="0 0 32 32" width={size} height={size} fill="black">
        <animated.path d={d} />
      </svg>
    </button>
  );
}