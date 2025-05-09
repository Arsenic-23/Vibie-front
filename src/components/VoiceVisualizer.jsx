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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!isActive) {
      cancelAnimationFrame(animationIdRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const smoothedArray = new Float32Array(bufferLength).fill(0);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        audioCtxRef.current = audioCtx;
        sourceRef.current = source;

        const draw = () => {
          animationIdRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const barCount = 20;
          const spacing = canvas.width / barCount;
          const maxHeight = canvas.height;

          for (let i = 0; i < barCount; i++) {
            const index = Math.floor((i / barCount) * bufferLength);
            const value = dataArray[index] || 0;
            const targetHeight = (value / 255) * maxHeight;

            // Smooth interpolation
            smoothedArray[i] += (targetHeight - smoothedArray[i]) * 0.2;

            const barHeight = smoothedArray[i];
            const x = i * spacing + spacing / 4;
            const y = (canvas.height - barHeight) / 2;

            ctx.fillStyle = '#a855f7';
            ctx.fillRect(x, y, spacing / 2, barHeight);
            ctx.roundRect?.(x, y, spacing / 2, barHeight, 4);
          }
        };

        draw();
      } catch (err) {
        console.error('Microphone access denied or error:', err);
      }
    };

    setupAudio();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="h-6 w-24 sm:w-32 md:w-40"
      width={160}
      height={24}
    />
  );
}