import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AuroraBackground from './components/design/AuroraBackground';
import PageTransition from './components/design/PageTransition';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext';
import { createAppTheme } from './theme/theme';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AuthorDashboard = lazy(() => import('./pages/AuthorDashboard'));
const EditorDashboard = lazy(() => import('./pages/EditorDashboard'));
const ReviewerDashboard = lazy(() => import('./pages/ReviewerDashboard'));
const PublicPapers = lazy(() => import('./pages/PublicPapers'));
const PaperDetails = lazy(() => import('./pages/PaperDetails'));

const AppLoader = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      zIndex: 2000,
      pointerEvents: 'none',
    }}
  >
    <CircularProgress size={56} thickness={4} />
    <Typography variant="caption" sx={{ letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(226, 232, 240, 0.65)' }}>
      Initializing cosmos
    </Typography>
  </Box>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/papers" element={<PageTransition><PublicPapers /></PageTransition>} />
        <Route path="/papers/:id" element={<PageTransition><PaperDetails /></PageTransition>} />
        <Route
          path="/author/*"
          element={(
            <PrivateRoute>
              <PageTransition><AuthorDashboard /></PageTransition>
            </PrivateRoute>
          )}
        />
        <Route
          path="/editor/*"
          element={(
            <PrivateRoute>
              <PageTransition><EditorDashboard /></PageTransition>
            </PrivateRoute>
          )}
        />
        <Route
          path="/reviewer/*"
          element={(
            <PrivateRoute>
              <PageTransition><ReviewerDashboard /></PageTransition>
            </PrivateRoute>
          )}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AuroraBackground />
          <Suspense fallback={<AppLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ThemeModeProvider>
      <AppContent />
    </ThemeModeProvider>
  );
}

export default App;
