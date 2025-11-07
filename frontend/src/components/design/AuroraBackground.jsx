import { memo, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { auroraPalette } from '../../theme/gradients';

const AuroraBackground = () => {
  const canvasRef = useRef(null);
  const halos = useMemo(
    () => new Array(7).fill(null).map((_, index) => ({
      size: `${42 + Math.random() * 36}vw`,
      top: `${Math.random() * 90 - 15}%`,
      left: `${Math.random() * 90 - 15}%`,
      duration: 32 + Math.random() * 24,
      delay: index * 1.4,
      opacity: 0.22 + Math.random() * 0.18,
    })),
    [],
  );

  const lightTrails = useMemo(
    () => new Array(5).fill(null).map(() => ({
      width: `${30 + Math.random() * 30}vh`,
      height: `${0.3 + Math.random() * 0.7}vh`,
      top: `${Math.random() * 100}%`,
      rotate: `${-35 + Math.random() * 70}deg`,
      duration: 16 + Math.random() * 10,
      delay: Math.random() * 12,
    })),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let stars = [];

    const createStars = () => {
      const density = Math.min(420, Math.floor((width * height) / 3200));
      stars = new Array(density).fill(null).map(() => ({
        x: Math.random() * width * dpr,
        y: Math.random() * height * dpr,
        size: (Math.random() * 0.9 + 0.2) * dpr,
        velocity: (Math.random() * 0.2 + 0.05) * dpr,
        alpha: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      createStars();
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'rgba(2,6,23,0.55)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.globalCompositeOperation = 'lighter';
      stars.forEach((star) => {
        const twinkle = (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
        const size = star.size * (0.85 + twinkle * 0.35);
        const alpha = star.alpha * (0.5 + twinkle * 0.5);

        star.y -= star.velocity;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        context.beginPath();
        context.globalAlpha = alpha;
        context.fillStyle = '#f8fafc';
        context.arc(star.x, star.y, size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 20% 20%, rgba(15,23,42,0.95), #010414 70%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-20%',
          background: `conic-gradient(from 120deg, ${auroraPalette.join(',')})`,
          opacity: 0.14,
          filter: 'blur(220px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '-10%',
          background: 'radial-gradient(circle at 50% 80%, rgba(56,189,248,0.35), transparent 60%)',
          opacity: 0.35,
          mixBlendMode: 'screen',
          filter: 'blur(180px)',
        },
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.82,
        }}
      />

      {halos.map((halo, index) => (
        <motion.div
          key={`halo-${index}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: [0, halo.opacity, halo.opacity * 0.5, halo.opacity],
            scale: [0.92, 1.05, 0.98, 1.08],
            rotate: [0, 12, -14, 0],
          }}
          transition={{
            duration: halo.duration,
            delay: halo.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: halo.top,
            left: halo.left,
            width: halo.size,
            height: halo.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(148,163,233,0.25), transparent 60%)`,
            filter: 'blur(120px)',
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {lightTrails.map((trail, index) => (
        <motion.div
          key={`trail-${index}`}
          initial={{ x: '-30%' }}
          animate={{
            x: ['-30%', '120%'],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: trail.duration,
            repeat: Infinity,
            delay: trail.delay,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            position: 'absolute',
            top: trail.top,
            width: trail.width,
            height: trail.height,
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.85), transparent)',
            filter: 'blur(10px)',
            transform: `rotate(${trail.rotate})`,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          inset: '-15%',
          background: 'radial-gradient(circle at 80% 10%, rgba(59,130,246,0.28), transparent 65%)',
          filter: 'blur(200px)',
          mixBlendMode: 'screen',
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(circle at 50% 50%, rgba(14,165,233,0.2), transparent 70%)',
          filter: 'blur(180px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </Box>
  );
};

export default memo(AuroraBackground);
