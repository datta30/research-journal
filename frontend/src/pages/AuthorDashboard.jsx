import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add,
  Logout,
  AutoGraph,
  Article,
  UploadFile,
  RocketLaunch,
  AutoAwesome,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authorAPI } from '../services/api';
import PaperDetails from './PaperDetails';
import PageContainer from '../components/design/PageContainer';
import GlassCard from '../components/design/GlassCard';
import { motion } from 'framer-motion';

const AuthorDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/papers/:id" element={<PaperDetails />} />
    </Routes>
  );
};

const Dashboard = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    abstractText: '',
    keywords: '',
    file: null,
  });
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      console.log('Fetching papers...');
      console.log('Token:', localStorage.getItem('token'));
      const response = await authorAPI.getMyPapers();
      console.log('Papers response:', response);
      setPapers(response.data);
    } catch (err) {
      console.error('Error fetching papers:', err);
      console.error('Error response:', err.response);
      setError('Failed to fetch papers: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ title: '', abstractText: '', keywords: '', file: null });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('abstractText', formData.abstractText);
    data.append('keywords', formData.keywords);
    data.append('file', formData.file);

    try {
      await authorAPI.submitPaper(data);
      setSuccess('Paper submitted successfully!');
      handleCloseDialog();
      fetchPapers();
    } catch (err) {
      setError(err.response?.data || 'Failed to submit paper');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      SUBMITTED: 'info',
      UNDER_REVIEW: 'warning',
      REVISION_REQUIRED: 'error',
      REVISED: 'warning',
      ACCEPTED: 'success',
      REJECTED: 'error',
      PUBLISHED: 'success',
    };
    return colors[status] || 'default';
  };

  const statusSummary = useMemo(() => {
    const summary = {
      total: papers.length,
      inReview: 0,
      needsRevision: 0,
      published: 0,
    };

    papers.forEach((paper) => {
      if (['UNDER_REVIEW', 'REVISED', 'SUBMITTED'].includes(paper.status)) {
        summary.inReview += 1;
      }
      if (paper.status === 'REVISION_REQUIRED') {
        summary.needsRevision += 1;
      }
      if (paper.status === 'PUBLISHED') {
        summary.published += 1;
      }
    });

    return summary;
  }, [papers]);

  const statCards = [
    {
      label: 'Total Manuscripts',
      value: statusSummary.total,
      helper: 'All submissions across every stage',
      icon: <Article fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(14,165,233,0.35))',
    },
    {
      label: 'In Motion',
      value: statusSummary.inReview,
      helper: 'Currently being peer reviewed',
      icon: <AutoGraph fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(20,184,166,0.35), rgba(59,130,246,0.35))',
    },
    {
      label: 'Needs Refinement',
      value: statusSummary.needsRevision,
      helper: 'Awaiting your revised submission',
      icon: <UploadFile fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(251,191,36,0.35), rgba(248,113,113,0.35))',
    },
    {
      label: 'Published',
      value: statusSummary.published,
      helper: 'Celebrated in the public library',
      icon: <Article fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(129,140,248,0.35), rgba(56,189,248,0.35))',
    },
  ];

  const hero = (
    <GlassCard
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      sx={{ p: { xs: 4, md: 6 }, overflow: 'visible' }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0.12, scale: 0.92 }}
        animate={{ opacity: [0.12, 0.25, 0.15], scale: [0.95, 1.05, 0.98] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          inset: '-90px',
          background:
            'radial-gradient(circle at 15% 20%, rgba(56,189,248,0.25), transparent 60%), ' +
            'radial-gradient(circle at 85% 30%, rgba(129,140,248,0.22), transparent 65%)',
          filter: 'blur(140px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ rotate: -6, opacity: 0 }}
        animate={{ rotate: 0, opacity: 0.65 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          position: 'absolute',
          top: { xs: -140, md: -160 },
          right: { xs: -80, md: -120 },
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.22), transparent 62%)',
          filter: 'blur(70px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<RocketLaunch fontSize="small" />}
                label="Author orbit"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.18)',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(191, 219, 254, 0.95)',
                  fontWeight: 600,
                  px: 2,
                }}
              />
              <Stack direction="row" spacing={0.5} alignItems="center" color="rgba(244, 244, 245, 0.72)">
                <AutoAwesome fontSize="small" />
                <Typography variant="caption" sx={{ letterSpacing: '0.08em' }}>
                  Storycraft elevated
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
              Welcome back, {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
              Craft, iterate, and launch your manuscripts with a cinematic publishing workspace tuned for velocity and narrative resonance.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenDialog}
              size="large"
              sx={{ minWidth: 200 }}
            >
              Submit Manuscript
            </Button>
            <Tooltip title="Sign out">
              <IconButton
                onClick={handleLogout}
                size="large"
                sx={{
                  backgroundColor: 'rgba(248, 113, 113, 0.16)',
                  '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.32)' },
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.45 }}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  backgroundImage: stat.color,
                  border: '1px solid rgba(148, 163, 209, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 30px 70px rgba(15, 23, 42, 0.38)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(150deg, rgba(255, 255, 255, 0.18), transparent 65%)',
                    opacity: 0,
                    transition: 'opacity 0.45s ease',
                  },
                  '&:hover::after': {
                    opacity: 0.35,
                  },
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.12, 0.28, 0.15], scale: [0.9, 1.05, 0.98] }}
                  transition={{ duration: 12 + index * 3, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    inset: '-55%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.32), transparent 58%)',
                    filter: 'blur(70px)',
                    pointerEvents: 'none',
                  }}
                />
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(15, 23, 42, 0.35)',
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box component={motion.div} animate={{ rotate: [0, 6, -4, 0] }} transition={{ duration: 6, repeat: Infinity, delay: index * 0.4, ease: 'easeInOut' }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}
                  >
                    {stat.label}
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.helper}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </GlassCard>
  );

  return (
    <PageContainer hero={hero} align="stretch">
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress size={72} thickness={4} />
        </Box>
      ) : (
        <GlassCard
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          sx={{
            p: { xs: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0.08, y: -20 }}
            animate={{ opacity: 0.18, y: [ -20, 0, -10 ] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            sx={{
              position: 'absolute',
              inset: '-120px',
              background: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.18), transparent 60%)',
              filter: 'blur(120px)',
              pointerEvents: 'none',
            }}
          />
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Manuscript Timeline
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track progress, respond to revisions, and navigate each submission with clarity.
                </Typography>
              </Box>
            </Stack>

            <Divider light />

            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {papers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography variant="h6" gutterBottom>
                          No papers submitted yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Kickstart your first submission with the "Submit Manuscript" button above.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    papers.map((paper, index) => (
                      <TableRow
                        key={paper.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.04 }}
                        sx={{ '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)' } }}
                      >
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {paper.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            v{paper.currentVersion} • Last updated {new Date(paper.updatedAt || paper.submittedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{new Date(paper.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={paper.status.replace(/_/g, ' ')}
                            color={getStatusColor(paper.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>v{paper.currentVersion}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/author/papers/${paper.id}`)}
                          >
                            Open dossier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </GlassCard>
      )}

      {/* Submit Paper Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Submit New Paper</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Paper Title"
              type="text"
              fullWidth
              required
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="abstractText"
              label="Abstract"
              multiline
              rows={4}
              fullWidth
              required
              value={formData.abstractText}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="keywords"
              label="Keywords (comma-separated)"
              type="text"
              fullWidth
              value={formData.keywords}
              onChange={handleChange}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" component="label">
                Upload File (PDF)
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </Button>
              {formData.file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {formData.file.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default AuthorDashboard;
