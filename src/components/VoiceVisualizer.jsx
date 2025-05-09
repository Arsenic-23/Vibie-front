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
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      audioCtxRef.current = audioCtx;
      sourceRef.current = source;

      const draw = () => {
        animationIdRef.current = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#a855f7';
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
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