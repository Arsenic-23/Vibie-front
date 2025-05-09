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

        const dotCount = 16;
        const centerY = canvas.height / 2;
        const spacing = canvas.width / dotCount;
        const maxDotHeight = canvas.height / 2;

        for (let i = 0; i < dotCount; i++) {
          const value = dataArray[i] || 0;
          const normalized = value / 255;
          const dotHeight = normalized * maxDotHeight;

          const x = spacing * i + spacing / 2;
          const yTop = centerY - dotHeight;
          const yBottom = centerY + dotHeight;

          const radius = 3;

          // Top dot
          ctx.beginPath();
          ctx.arc(x, yTop, radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#a855f7';
          ctx.fill();

          // Bottom dot (symmetrical)
          ctx.beginPath();
          ctx.arc(x, yBottom, radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#a855f7';
          ctx.fill();
        }
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
      className="h-8 w-32 md:w-40 lg:w-48"
      width={160}
      height={32}
    />
  );
}