import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const PageContainer = ({ hero, children, align = 'center', maxWidth = 'lg', gap = 6 }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
      pt: { xs: 16, md: 18 },
      pb: { xs: 10, md: 14 },
      px: { xs: 3, md: 0 },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '12% 8% auto 8%',
        height: '66%',
        background:
          'linear-gradient(120deg, rgba(56, 189, 248, 0.08), rgba(129, 140, 248, 0.05) 40%, transparent)',
        filter: 'blur(80px)',
        opacity: 0.7,
        zIndex: -1,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: '20% -40% 10% -40%',
        backgroundImage:
          'radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.055), transparent 42%), ' +
          'radial-gradient(circle at 100% 30%, rgba(56, 189, 248, 0.08), transparent 45%)',
        opacity: 0.5,
        filter: 'blur(90px)',
        zIndex: -1,
      },
    }}
  >
    <ThemeToggle />
    <Box
      sx={{
        position: 'absolute',
        inset: '14% 4% 8% 4%',
        backgroundImage:
          'linear-gradient(rgba(148, 163, 233, 0.08) 1px, transparent 1px), ' +
          'linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px)',
        backgroundSize: '220px 220px',
        opacity: 0.45,
        maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />

    <Container
      component={motion.div}
      maxWidth={maxWidth}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap, position: 'relative', zIndex: 1 }}
    >
      {hero}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: align === 'center' ? 'center' : 'flex-start',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Container>
  </Box>
);

export default PageContainer;
