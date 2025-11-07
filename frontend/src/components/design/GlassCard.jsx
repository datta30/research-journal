import { forwardRef } from 'react';
import { Paper } from '@mui/material';

const GlassCard = forwardRef(function GlassCard({ children, sx = {}, elevation = 0, ...props }, ref) {
  return (
    <Paper
      ref={ref}
      elevation={elevation}
      sx={{
        position: 'relative',
        borderRadius: 3,
        background: 'rgba(6, 12, 24, 0.78)',
        backdropFilter: 'blur(22px) saturate(135%)',
        border: '1px solid rgba(148, 163, 209, 0.18)',
        boxShadow: '0 38px 120px rgba(8, 17, 35, 0.6)',
        overflow: 'hidden',
        transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border 0.45s ease',
        transform: 'translateZ(0)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-1px',
          background: 'linear-gradient(140deg, rgba(148, 163, 233, 0.25), transparent 50%)',
          opacity: 0.65,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(120deg, transparent 35%, rgba(255, 255, 255, 0.18) 45%, transparent 60%)',
          opacity: 0,
          transition: 'opacity 0.45s ease, transform 0.45s ease',
          transform: 'translateY(-20%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        },
        '&:hover': {
          transform: 'translateY(-10px) scale(1.01)',
          boxShadow: '0 55px 160px rgba(8, 17, 35, 0.7)',
          border: '1px solid rgba(191, 219, 254, 0.32)',
          '&::after': {
            opacity: 1,
            transform: 'translateY(0%)',
          },
        },
        '& .glasscard-shine': {
          position: 'absolute',
          inset: '-60% -40%',
          background: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.18), transparent 60%)',
          opacity: 0.35,
          mixBlendMode: 'screen',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      <span className="glasscard-shine" />
      {children}
    </Paper>
  );
});

export default GlassCard;
