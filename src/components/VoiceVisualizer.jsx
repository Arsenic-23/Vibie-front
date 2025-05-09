// components/VoiceVisualizer.js
import React, { useEffect, useRef } from 'react';

export default function VoiceVisualizer({ isActive }) {
  const canvasRef = useRef(null);
  const animationIdRef = useRef();
  const analyserRef = useRef();
  const dataArrayRef = useRef();
  const audioCtxRef = useRef();
  const sourceRef = useRef();

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(animationIdRef.current);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setupAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      audioCtxRef.current = audioCtx;
      sourceRef.current = source;

      const draw = () => {
        animationIdRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / bufferLength;
        dataArray.forEach((value, i) => {
          const barHeight = value / 2;
          const x = i * barWidth;
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        });
      };

      draw();
    };

    setupAudio();

    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="h-6 w-24 md:w-28 lg:w-32"
      width={120}
      height={24}
    />
  );
}