import { IconButton, Tooltip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeModeContext';

const ThemeToggle = () => {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        zIndex: 2,
      }}
    >
      <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <IconButton
          size="large"
          onClick={toggleColorMode}
          aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
          sx={{
            backgroundColor: isDark ? 'rgba(148, 163, 209, 0.18)' : 'rgba(99, 102, 241, 0.12)',
            boxShadow: isDark
              ? '0 18px 32px rgba(15, 23, 42, 0.45)'
              : '0 12px 22px rgba(99, 102, 241, 0.18)',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(148, 163, 209, 0.3)' : 'rgba(99, 102, 241, 0.2)',
              transform: 'translateY(-2px)',
            },
            transition: theme.transitions.create(['transform', 'background-color', 'box-shadow'], {
              duration: 300,
              easing: theme.transitions.easing.easeOut,
            }),
          }}
        >
          {isDark ? <LightMode fontSize="inherit" /> : <DarkMode fontSize="inherit" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeToggle;
