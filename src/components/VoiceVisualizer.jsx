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
          const maxHeight = canvas.height * 0.7;
          const centerX = canvas.width / 2;
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const isIdle = average < 10;
          if (isIdle) idlePhase += 0.1;

          for (let i = 0; i < dotCount; i++) {
            const index = Math.floor((i / dotCount) * dataArray.length);
            let value = dataArray[index] || 0;
            let target = (value / 255) * maxHeight + 3;

            if (isIdle) {
              target = Math.sin(idlePhase + i * 0.6) * 2.5 + 5;
            }

            // Emphasize center propagation
            const distanceFromCenter = Math.abs(i - (dotCount - 1) / 2);
            const scale = 1 - (distanceFromCenter / ((dotCount - 1) / 2)) * 0.3;
            target *= scale;

            smooth[i] += (target - smooth[i]) * 0.3;

            const height = smooth[i];
            const offset = (i - (dotCount - 1) / 2) * spacing;
            const x = centerX + offset;
            const y = canvas.height / 2;
            const rx = spacing * 0.14;
            const ry = height / 2;

            const gradient = ctx.createLinearGradient(x, y - ry, x, y + ry);
            gradient.addColorStop(0, '#38bdf8'); // light blue
            gradient.addColorStop(1, '#0ea5e9'); // darker blue

            ctx.fillStyle = gradient;
            ctx.shadowColor = '#7dd3fc';
            ctx.shadowBlur = 3;

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
      className="h-5 w-32 sm:w-40 md:w-44"
      width={176}
      height={20}
    />
  );
}