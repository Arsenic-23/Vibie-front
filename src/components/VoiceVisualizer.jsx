import React, { useEffect, useRef } from 'react';

export default function VoiceVisualizer({ isActive }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const audioCtxRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!isActive) {
      cancelAnimationFrame(animationRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 32;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const dotCount = 6;
        const smooth = new Float32Array(dotCount).fill(0);
        audioCtxRef.current = audioCtx;

        let idlePhase = 0;

        const draw = () => {
          animationRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const spacing = canvas.width / (dotCount + 1);
          const maxHeight = canvas.height * 1.2; // Taller
          const centerX = canvas.width / 2;
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const isIdle = average < 10;
          if (isIdle) idlePhase += 0.08;

          for (let i = 0; i < dotCount; i++) {
            const index = Math.floor((i / dotCount) * dataArray.length);
            let value = dataArray[index] || 0;
            let target = (value / 255) * maxHeight + 6;

            if (isIdle) {
              target = Math.sin(idlePhase + i * 0.5) * 3 + 6;
            }

            // Emphasize center propagation
            const distanceFromCenter = Math.abs(i - (dotCount - 1) / 2);
            const scale = 1 - (distanceFromCenter / ((dotCount - 1) / 2)) * 0.25;
            target *= scale;

            smooth[i] += (target - smooth[i]) * 0.25;

            const height = smooth[i];
            const offset = (i - (dotCount - 1) / 2) * spacing;
            const x = centerX + offset;
            const y = canvas.height / 2;
            const rx = spacing * 0.2; // Wider
            const ry = height / 2;

            const gradient = ctx.createLinearGradient(x, y - ry, x, y + ry);
            gradient.addColorStop(0, '#c084fc'); // lavender
            gradient.addColorStop(1, '#9333ea'); // deep purple

            ctx.fillStyle = gradient;
            ctx.shadowColor = '#e9d5ff';
            ctx.shadowBlur = 6;

            ctx.beginPath();
            ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
            ctx.fill();
          }

          ctx.shadowBlur = 0;
        };

        draw();
      } catch (err) {
        console.error('Mic error:', err);
      }
    };

    setup();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="h-6 w-36 sm:w-44 md:w-48"
      width={192}
      height={24}
    />
  );
}