import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Stack,
  Divider,
  Grid,
  Avatar,
} from '@mui/material';
import { RocketLaunch, School, Hub, Verified } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import PageContainer from '../components/design/PageContainer';
import GlassCard from '../components/design/GlassCard';

const ROLES = ['AUTHOR', 'EDITOR', 'REVIEWER'];

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    affiliation: '',
    orcidId: '',
    roles: ['AUTHOR'],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, roles: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hero = (
    <Stack spacing={2} component={motion.div} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <Chip
        icon={<Hub sx={{ color: '#22d3ee' }} />}
        label="Activate your role in the research constellation"
        sx={{
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(34, 211, 238, 0.16)',
          color: '#a5f3fc',
          backdropFilter: 'blur(8px)',
        }}
      />
      <Typography variant="h2" sx={{ maxWidth: 700 }}>
        Elevate your publishing journey with a studio built for visionaries
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640 }}>
        Register to submit groundbreaking research, orchestrate peer reviews, or deliver incisive
        critiques. Configure your multi-role identity in a canvas tuned for brilliance.
      </Typography>
    </Stack>
  );

  return (
    <PageContainer hero={hero} align="stretch" maxWidth="lg">
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={7}>
          <GlassCard
            component={motion.div}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
            sx={{ p: { xs: 4, md: 6 }, height: '100%' }}
          >
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RocketLaunch fontSize="large" /> Create your command center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Personalize your profile for the roles you perform across the research lifecycle.
                </Typography>
              </Stack>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success">
                  Registration successful! Redirecting to login...
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
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
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  fullWidth
                  name="affiliation"
                  label="Affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                />
                <TextField
                  margin="dense"
                  fullWidth
                  name="orcidId"
                  label="ORCID ID"
                  value={formData.orcidId}
                  onChange={handleChange}
                  sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}
                />
                <FormControl fullWidth margin="dense" sx={{ gridColumn: '1 / -1' }}>
                  <InputLabel>Roles</InputLabel>
                  <Select
                    multiple
                    value={formData.roles}
                    onChange={handleRoleChange}
                    input={<OutlinedInput label="Roles" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} color="secondary" variant="outlined" />
                        ))}
                      </Box>
                    )}
                  >
                    {ROLES.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || success}
                  size="large"
                  sx={{ gridColumn: '1 / -1', mt: 1 }}
                >
                  {loading ? 'Registering...' : 'Activate account'}
                </Button>
              </Box>

              <Divider light>
                <Button component={Link} to="/login" variant="text" color="secondary">
                  Already onboard? Sign in here
                </Button>
              </Divider>
            </Stack>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <GlassCard
            component={motion.div}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            sx={{ p: { xs: 4, md: 6 }, height: '100%' }}
          >
            <Stack spacing={4}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School fontSize="large" /> Why scholars choose us
              </Typography>
              <Stack spacing={3}>
                {[
                  {
                    title: 'Unified workspace',
                    desc: 'Authors, editors, and reviewers collaborate inside a shared, context-rich hub with cinematic fidelity.',
                  },
                  {
                    title: 'Precision workflows',
                    desc: 'Automated status tracking, revision orchestration, and decision intelligence crafted for elite editorial teams.',
                  },
                  {
                    title: 'Amplified exposure',
                    desc: 'Published works shine with immersive presentation, responsive interactions, and optimized discoverability.',
                  },
                ].map((item) => (
                  <Stack direction="row" spacing={2} key={item.title}>
                    <Avatar sx={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe', width: 48, height: 48 }}>
                      <Verified />
                    </Avatar>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
              <Divider light>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Join a network of pioneering journals redefining scholarly communication.
                </Typography>
              </Divider>
            </Stack>
          </GlassCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Register;
