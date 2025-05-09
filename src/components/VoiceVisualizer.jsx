import React, { useEffect, useRef } from 'react';

export default function VoiceVisualizer({ isActive }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const audioCtxRef = useRef();
  const idlePulseRef = useRef(0);

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
        const smooth = new Float32Array(8).fill(0);
        audioCtxRef.current = audioCtx;

        let idlePulsePhase = 0;

        const draw = () => {
          animationRef.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const dots = 8;
          const spacing = canvas.width / dots;
          const maxH = canvas.height * 0.9;

          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const isIdle = average < 10;

          if (isIdle) idlePulsePhase += 0.05;

          for (let i = 0; i < dots; i++) {
            const index = Math.floor((i / dots) * dataArray.length);
            let value = dataArray[index] || 0;
            let target = (value / 255) * maxH + 4;

            // Idle pulse effect
            if (isIdle) {
              const pulse = Math.sin(idlePulsePhase + i * 0.5) * 6 + 6;
              target = pulse;
            }

            smooth[i] += (target - smooth[i]) * 0.25;

            const h = smooth[i];
            const x = i * spacing + spacing / 2;
            const y = canvas.height / 2;
            const rx = spacing * 0.25;
            const ry = h / 2;

            const gradient = ctx.createLinearGradient(x, y - ry, x, y + ry);
            gradient.addColorStop(0, '#f0abfc'); // bright pink
            gradient.addColorStop(1, '#7c3aed'); // bright purple

            ctx.fillStyle = gradient;
            ctx.shadowColor = '#e879f9';
            ctx.shadowBlur = 12;

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
      className="h-8 w-40 sm:w-48 md:w-52"
      width={208}
      height={32}
    />
  );
}