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
        analyser.fftSize = 32;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const smoothedArray = new Float32Array(12).fill(0); // one for each dot

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        audioCtxRef.current = audioCtx;
        sourceRef.current = source;

        const draw = () => {
          animationIdRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const dotCount = 12;
          const spacing = canvas.width / dotCount;
          const maxHeight = canvas.height * 0.8;

          for (let i = 0; i < dotCount; i++) {
            const index = Math.floor((i / dotCount) * bufferLength);
            const value = dataArray[index] || 0;
            const targetHeight = (value / 255) * maxHeight + 4;

            // Smooth interpolation
            smoothedArray[i] += (targetHeight - smoothedArray[i]) * 0.1;

            const barHeight = smoothedArray[i];
            const centerX = i * spacing + spacing / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(spacing / 3, barHeight / 2);

            ctx.fillStyle = '#a855f7';

            // Draw rounded capsule-like dot
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radius, barHeight / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
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
      className="h-8 w-40 sm:w-48 md:w-56"
      width={224}
      height={32}
    />
  );
}