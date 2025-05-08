import React, { useEffect, useRef } from 'react';

export default function AdvancedVoiceVisualizer({ isListening }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (!isListening) {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 80;

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaStreamRef.current = stream;

      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);

      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);

        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const colors = ['#8e44ad', '#3498db', '#e67e22', '#2ecc71'];
        const waves = 4;

        for (let j = 0; j < waves; j++) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = colors[j % colors.length];
          for (let i = 0; i < canvas.width; i++) {
            const index = Math.floor((i / canvas.width) * dataArrayRef.current.length);
            const value = dataArrayRef.current[index] / 128.0;
            const y = (canvas.height / 2) + Math.sin(i * 0.03 + j * 10) * value * 20;
            ctx.lineTo(i, y);
          }
          ctx.stroke();
        }
      };

      draw();
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [isListening]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute right-10 top-1/2 transform -translate-y-1/2"
      style={{ width: '300px', height: '80px' }}
    />
  );
}