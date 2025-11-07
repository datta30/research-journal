import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import { LockOpen, TravelExplore, Insights, Diversity3 } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/design/PageContainer';
import GlassCard from '../components/design/GlassCard';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      console.log('Login response:', response.data);
      const { token, userId, email, firstName, lastName, roles } = response.data;
      
      login(token, { userId, email, firstName, lastName, roles });
      
      // Redirect based on role
      if (roles && roles.includes('EDITOR')) {
        navigate('/editor/dashboard');
      } else if (roles && roles.includes('REVIEWER')) {
        navigate('/reviewer/dashboard');
      } else {
        navigate('/author/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hero = (
    <Stack spacing={2} component={motion.div} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <Chip
        icon={<TravelExplore sx={{ color: '#38bdf8' }} />}
        label="Welcome back, curator"
        sx={{
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(14, 165, 233, 0.15)',
          color: '#bae6fd',
          backdropFilter: 'blur(8px)',
        }}
      />
      <Typography variant="h2" sx={{ maxWidth: 680 }}>
        Reconnect with the future of scholarly publishing
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640 }}>
        Access your collaborative workspace, manage submissions, coordinate reviews, and deliver
        polished publications with our immersive journal studio.
      </Typography>
    </Stack>
  );

  return (
    <PageContainer hero={hero} align="stretch" maxWidth="lg">
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <GlassCard
            component={motion.div}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            sx={{ p: { xs: 4, md: 6 }, height: '100%' }}
          >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockOpen fontSize="large" /> Secure Login
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Validate your credentials to synchronize your personalized publishing cockpit.
                </Typography>
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button type="submit" fullWidth variant="contained" disabled={loading} size="large">
                  {loading ? 'Synchronizing...' : 'Sign In'}
                </Button>
              </Box>

              <Divider light>
                <Typography variant="body2" color="text.secondary">
                  Need access?
                </Typography>
              </Divider>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={(theme) => ({
                    fontWeight: 700,
                    borderColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.65)'
                        : theme.palette.primary.main,
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.primary.dark,
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(148, 163, 209, 0.18)'
                        : 'rgba(99, 102, 241, 0.1)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 18px 28px rgba(15, 23, 42, 0.45)'
                        : '0 14px 24px rgba(99, 102, 241, 0.15)',
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(148, 163, 209, 0.32)'
                          : 'rgba(99, 102, 241, 0.2)',
                      borderColor:
                        theme.palette.mode === 'dark'
                          ? theme.palette.common.white
                          : theme.palette.primary.dark,
                    },
                  })}
                >
                  Create an account
                </Button>
                <Button
                  component={RouterLink}
                  to="/papers"
                  color="secondary"
                  variant="contained"
                  fullWidth
                  size="large"
                >
                  Explore publications
                </Button>
              </Stack>
            </Stack>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GlassCard
            component={motion.div}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            sx={{ p: { xs: 4, md: 6 }, height: '100%' }}
          >
            <Stack spacing={4}>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Insights fontSize="large" /> What awaits inside
              </Typography>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="text.secondary">
                    <strong>Real-time oversight</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor submission momentum, reviewer velocity, and decision analytics engineered for precision publishing.
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="text.secondary">
                    <strong>Immersive collaboration</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Share context-rich feedback, orchestrate revisions, and guide authors with cinematic clarity.
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" color="text.secondary">
                    <strong>Scholarly resonance</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Publish with luminous presentation, smooth motion, and a discoverability engine tuned for global reach.
                  </Typography>
                </Stack>
              </Stack>

              <Divider light>
                <Chip icon={<Diversity3 />} label="Trusted by editors, authors, and reviewers worldwide" sx={{ backgroundColor: 'rgba(34, 211, 238, 0.16)', color: '#a5f3fc' }} />
              </Divider>
            </Stack>
          </GlassCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
