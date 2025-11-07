import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { auroraPalette } from './gradients';

const paletteByMode = {
  dark: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#22d3ee' },
    background: {
      default: '#020817',
      paper: 'rgba(15, 23, 42, 0.7)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5f5',
    },
  },
  light: {
    mode: 'light',
    primary: { main: '#4338ca' },
    secondary: { main: '#0ea5e9' },
    background: {
      default: '#f5f7fb',
      paper: 'rgba(255, 255, 255, 0.88)',
    },
    text: {
      primary: '#0f172a',
      secondary: '#334155',
    },
  },
};

const typography = {
  fontFamily: '"Inter Variable", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 800, letterSpacing: '-0.04em' },
  h2: { fontWeight: 700, letterSpacing: '-0.03em' },
  h3: { fontWeight: 700, letterSpacing: '-0.02em' },
  h4: { fontWeight: 700 },
  subtitle1: { fontWeight: 600, letterSpacing: '-0.01em' },
  button: { textTransform: 'none', fontWeight: 600, letterSpacing: '-0.01em' },
};

const auroraShadows = Array.from({ length: 25 }, (_, index) => {
  if (index === 0) return 'none';
  const intensity = Math.min(index * 4, 64);
  return `0 ${index}px ${intensity}px rgba(99, 102, 241, 0.25)`;
});

const getComponentOverrides = (mode) => ({
  MuiPaper: {
    styleOverrides: {
      root: {
        backdropFilter: 'blur(24px)',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)'
            : 'linear-gradient(140deg, rgba(255,255,255,0.95) 0%, rgba(226,232,240,0.88) 100%)',
        border:
          mode === 'dark'
            ? '1px solid rgba(148, 163, 209, 0.15)'
            : '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow:
          mode === 'dark'
            ? '0 28px 60px rgba(15, 23, 42, 0.42)'
            : '0 20px 48px rgba(148, 163, 209, 0.28)',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 999,
        padding: '12px 24px',
        transition: 'all 0.35s ease',
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(120deg, rgba(99, 102, 241, 0.9), rgba(34, 211, 238, 0.9))'
            : 'linear-gradient(120deg, rgba(99, 102, 241, 0.85), rgba(14, 165, 233, 0.85))',
        boxShadow:
          mode === 'dark'
            ? '0 20px 40px rgba(99, 102, 241, 0.35)'
            : '0 18px 36px rgba(99, 102, 241, 0.2)',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.015)',
          boxShadow:
            mode === 'dark'
              ? '0 30px 60px rgba(99, 102, 241, 0.45)'
              : '0 26px 52px rgba(99, 102, 241, 0.28)',
        },
      },
      containedSecondary: {
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(135deg, rgba(34, 211, 238,0.95), rgba(20, 184, 166,0.95))'
            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.95), rgba(16, 185, 129, 0.9))',
      },
      outlined: {
        borderWidth: 2,
        borderColor: mode === 'dark' ? 'rgba(148, 163, 209, 0.4)' : 'rgba(67, 56, 202, 0.35)',
        color: mode === 'dark' ? '#f9fafb' : '#312e81',
        backgroundColor: mode === 'dark' ? 'rgba(148, 163, 209, 0.08)' : 'rgba(99, 102, 241, 0.08)',
        '&:hover': {
          borderColor: mode === 'dark' ? '#22d3ee' : '#4338ca',
          backgroundColor: mode === 'dark' ? 'rgba(34, 211, 238, 0.08)' : 'rgba(99, 102, 241, 0.16)',
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 64, 175, 0.85))'
            : 'linear-gradient(135deg, rgba(226, 232, 240, 0.92), rgba(191, 219, 254, 0.85))',
        backdropFilter: 'blur(12px)',
        borderBottom:
          mode === 'dark'
            ? '1px solid rgba(148, 163, 209, 0.25)'
            : '1px solid rgba(148, 163, 209, 0.35)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: mode === 'dark'
          ? '1px solid rgba(148, 163, 209, 0.1)'
          : '1px solid rgba(148, 163, 209, 0.25)',
      },
      head: {
        fontWeight: 700,
        color: mode === 'dark' ? '#e0e7ff' : '#1e293b',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundImage:
          mode === 'dark'
            ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(17, 24, 39, 0.85))'
            : 'linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(226, 232, 240, 0.9))',
        border:
          mode === 'dark'
            ? '1px solid rgba(148, 163, 209, 0.2)'
            : '1px solid rgba(15, 23, 42, 0.12)',
      },
    },
  },
});

export const createAppTheme = (mode = 'dark') => {
  const palette = paletteByMode[mode] || paletteByMode.dark;

  const baseTheme = createTheme({
    typography,
    palette,
    shape: { borderRadius: 20 },
  });

  return deepmerge(baseTheme, {
    shadows: auroraShadows,
    components: getComponentOverrides(mode),
    palette: {
      aurora: auroraPalette,
    },
  });
};

const theme = createAppTheme('dark');

export default theme;
