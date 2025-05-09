import React, { useEffect, useRef } from 'react';

export default function VoiceVisualizer({ isActive, audioStream }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const audioCtxRef = useRef();
  const analyserRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!isActive || !audioStream) {
      cancelAnimationFrame(animationRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    const setup = () => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;

      const source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const smooth = new Float32Array(6).fill(0);
      let idlePhase = 0;

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const spacing = canvas.width / 7;
        const maxHeight = canvas.height * 1.2;
        const centerX = canvas.width / 2;
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const isIdle = average < 10;
        if (isIdle) idlePhase += 0.08;

        for (let i = 0; i < 6; i++) {
          const index = Math.floor((i / 6) * dataArray.length);
          let value = dataArray[index] || 0;
          let target = (value / 255) * maxHeight + 6;

          if (isIdle) {
            target = Math.sin(idlePhase + i * 0.5) * 3 + 6;
          }

          const distanceFromCenter = Math.abs(i - 2.5);
          const scale = 1 - (distanceFromCenter / 2.5) * 0.25;
          target *= scale;

          smooth[i] += (target - smooth[i]) * 0.25;

          const height = smooth[i];
          const offset = (i - 2.5) * spacing;
          const x = centerX + offset;
          const y = (canvas.height - height) / 2;
          const width = spacing * 0.3;
          const radius = width / 2;

          const gradient = ctx.createLinearGradient(x, y, x, y + height);
          gradient.addColorStop(0, '#c084fc');
          gradient.addColorStop(1, '#9333ea');

          ctx.fillStyle = gradient;

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x - width / 2, y, width, height, radius);
          } else {
            // Fallback for browsers without roundRect
            ctx.moveTo(x - width / 2 + radius, y);
            ctx.lineTo(x + width / 2 - radius, y);
            ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + radius);
            ctx.lineTo(x + width / 2, y + height - radius);
            ctx.quadraticCurveTo(x + width / 2, y + height, x + width / 2 - radius, y + height);
            ctx.lineTo(x - width / 2 + radius, y + height);
            ctx.quadraticCurveTo(x - width / 2, y + height, x - width / 2, y + height - radius);
            ctx.lineTo(x - width / 2, y + radius);
            ctx.quadraticCurveTo(x - width / 2, y, x - width / 2 + radius, y);
          }
          ctx.fill();
        }
      };

      draw();
    };

    setup();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [isActive, audioStream]);

  return (
    <canvas
      ref={canvasRef}
      className="h-6 w-36 sm:w-44 md:w-48"
      width={192}
      height={24}
    />
  );
}