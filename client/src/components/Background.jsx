import React, { useEffect, useRef } from 'react';

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Star properties
    const stars = [];
    const shootingStars = [];
    const starCount = 150;

    // Initialize static background stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2,
        opacity: Math.random() * 0.7 + 0.1,
        blinkSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    const createShootingStar = () => {
      // Shooting star starts from top-right area mostly
      const startX = Math.random() * canvas.width + canvas.width * 0.2;
      const startY = Math.random() * canvas.height * 0.5;
      
      shootingStars.push({
        x: startX,
        y: startY,
        len: Math.random() * 100 + 50,
        speed: Math.random() * 2 + 1, // "Slow motion" velocity
        opacity: 1,
        angle: 135 + (Math.random() * 20 - 10), // Coming from top-right
      });
    };

    let lastShootingStarTime = 0;

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw static stars with subtle blinking
      stars.forEach((s) => {
        s.opacity += s.blinkSpeed;
        if (s.opacity > 0.8 || s.opacity < 0.1) s.blinkSpeed *= -1;
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();
      });

      // 2. Create shooting stars (aiming for 5-6 per second)
      if (time - lastShootingStarTime > 160) { // Approx 6 per second (1000ms / 6)
        createShootingStar();
        lastShootingStarTime = time;
      }

      // 3. Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        
        // Move slowly
        const rad = (s.angle * Math.PI) / 180;
        s.x += Math.cos(rad) * s.speed;
        s.y += Math.sin(rad) * s.speed;
        s.opacity -= 0.01; // Fade out

        if (s.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Draw the trail
        const gradient = ctx.createLinearGradient(
          s.x, s.y, 
          s.x - Math.cos(rad) * s.len, 
          s.y - Math.sin(rad) * s.len
        );
        gradient.addColorStop(0, `rgba(99, 102, 241, ${s.opacity})`); // Primary Indigo
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(rad) * s.len, s.y - Math.sin(rad) * s.len);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] bg-[#030712]"
    />
  );
};

export default Background;
