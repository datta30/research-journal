import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Logout,
  RateReview,
  TaskAlt,
  PendingActions,
  CloudDownload,
  RocketLaunch,
  AutoAwesome,
  PictureAsPdf,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { reviewerAPI } from '../services/api';
import PageContainer from '../components/design/PageContainer';
import GlassCard from '../components/design/GlassCard';
import { motion } from 'framer-motion';
import { openPdfBlob } from '../utils/pdf';

const ReviewerDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewData, setReviewData] = useState({
    recommendation: '',
    comments: '',
    qualityScore: '',
    originalityScore: '',
    clarityScore: '',
    significanceScore: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewerAPI.getMyReviews();
      setReviews(response.data);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenDialog = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
    if (review.status === 'COMPLETED') {
      setReviewData({
        recommendation: review.recommendation || '',
        comments: review.comments || '',
        qualityScore: review.qualityScore || '',
        originalityScore: review.originalityScore || '',
        clarityScore: review.clarityScore || '',
        significanceScore: review.significanceScore || '',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReviewData({
      recommendation: '',
      comments: '',
      qualityScore: '',
      originalityScore: '',
      clarityScore: '',
      significanceScore: '',
    });
  };

  const handleChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async () => {
    try {
      await reviewerAPI.submitReview(selectedReview.id, reviewData);
      setSuccess('Review submitted successfully!');
      handleCloseDialog();
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const handleUpdateStatus = async (reviewId, status) => {
    try {
      await reviewerAPI.updateReviewStatus(reviewId, status);
      setSuccess('Status updated successfully!');
      fetchReviews();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleViewPaper = async (reviewId, paperTitle) => {
    try {
      const response = await reviewerAPI.downloadPaper(reviewId);
      openPdfBlob(response.data, `${paperTitle || 'paper'}.pdf`);
    } catch (err) {
      setError('Failed to open paper');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      IN_PROGRESS: 'info',
      COMPLETED: 'success',
    };
    return colors[status] || 'default';
  };

  const summary = useMemo(() => {
    const pending = reviews.filter((review) => review.status === 'PENDING').length;
    const inProgress = reviews.filter((review) => review.status === 'IN_PROGRESS').length;
    const completed = reviews.filter((review) => review.status === 'COMPLETED').length;

    return {
      total: reviews.length,
      pending,
      inProgress,
      completed,
    };
  }, [reviews]);

  const statCards = [
    {
      label: 'Total assignments',
      value: summary.total,
      helper: 'Across every journal you serve',
      icon: <RateReview fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(56,189,248,0.26))',
    },
    {
      label: 'Awaiting kickoff',
      value: summary.pending,
      helper: 'Ready for your analytical touch',
      icon: <PendingActions fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(251,191,36,0.35), rgba(248,113,113,0.28))',
    },
    {
      label: 'In progress',
      value: summary.inProgress,
      helper: 'Actively crafting insights',
      icon: <TaskAlt fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(34,197,94,0.3))',
    },
    {
      label: 'Completed',
      value: summary.completed,
      helper: 'Delivered verdicts',
      icon: <TaskAlt fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(34,197,94,0.35), rgba(56,189,248,0.24))',
    },
  ];

  const hero = (
    <GlassCard
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      sx={{
        p: { xs: 4, md: 6 },
        overflow: 'visible',
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0.15, scale: 0.95 }}
        animate={{ opacity: [0.12, 0.32, 0.18], scale: [0.97, 1.02, 0.99] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          inset: '-80px',
          background:
            'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.18), transparent 60%), ' +
            'radial-gradient(circle at 80% 30%, rgba(56, 189, 248, 0.22), transparent 65%)',
          filter: 'blur(140px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ rotate: -8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          position: 'absolute',
          top: { xs: -120, md: -140 },
          right: { xs: -60, md: -100 },
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          background: 'radial-gradient(circle, rgba(148, 163, 233, 0.22), transparent 65%)',
          filter: 'blur(60px)',
          opacity: 0.5,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={4}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<RocketLaunch fontSize="small" />}
                label="Mission control"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.16)',
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
                  Quantum-reviewed
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
              Review intelligence hub
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520 }}>
              Focus your expertise, orchestrate precise feedback, and elevate manuscripts with cinematic clarity and bio-luminescent insight.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="contained"
              startIcon={<CloudDownload />}
              onClick={fetchReviews}
              disabled={loading}
              size="large"
              sx={{ minWidth: 200 }}
            >
              Sync assignments
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
                  boxShadow: '0 28px 70px rgba(15, 23, 42, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(140deg, rgba(255, 255, 255, 0.18), transparent 65%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover::after': {
                    opacity: 0.35,
                  },
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.12, 0.3, 0.15], scale: [0.92, 1.06, 1] }}
                  transition={{ duration: 10 + index * 3, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    inset: '-50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.32), transparent 55%)',
                    filter: 'blur(60px)',
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
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
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

      <GlassCard
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        sx={{ p: { xs: 3, md: 4 } }}
      >
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Typography variant="h4">My Reviews</Typography>
            <Typography variant="body2" color="text.secondary">
              Deliver thoughtful assessments with precision scoring and contextual guidance.
            </Typography>
          </Stack>

          <Divider light />

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={6}>
              <CircularProgress size={64} thickness={4} />
            </Box>
          ) : (
            <TableContainer component={Box}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Paper Title</TableCell>
                    <TableCell>Assigned</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Recommendation</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography variant="h6" gutterBottom>
                          No reviews assigned yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expect invitations soon—your expertise is in demand.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviews.map((review, index) => (
                      <TableRow
                        key={review.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.04 }}
                        sx={{ '&:hover': { backgroundColor: 'rgba(56, 189, 248, 0.08)' } }}
                      >
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {review.paper?.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            Assigned {new Date(review.assignedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{new Date(review.assignedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={review.status.replace(/_/g, ' ')}
                            color={getStatusColor(review.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          {review.recommendation ? (
                            <Chip label={review.recommendation.replace(/_/g, ' ')} size="small" />
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PictureAsPdf fontSize="small" />}
                              onClick={() => handleViewPaper(review.id, review.paper?.title)}
                            >
                              View PDF
                            </Button>
                            {review.status === 'PENDING' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleUpdateStatus(review.id, 'IN_PROGRESS')}
                              >
                                Start review
                              </Button>
                            )}
                            {review.status !== 'COMPLETED' ? (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleOpenDialog(review)}
                              >
                                Submit review
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenDialog(review)}
                              >
                                View review
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </GlassCard>

      {/* Submit Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedReview?.status === 'COMPLETED' ? 'View Review' : 'Submit Review'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Paper: {selectedReview?.paper?.title}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={() => handleViewPaper(selectedReview?.id, selectedReview?.paper?.title)}
            sx={{ mb: 2 }}
            fullWidth
          >
            View Paper PDF
          </Button>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Recommendation</InputLabel>
            <Select
              name="recommendation"
              value={reviewData.recommendation}
              onChange={handleChange}
              label="Recommendation"
              disabled={selectedReview?.status === 'COMPLETED'}
            >
              <MenuItem value="ACCEPT">Accept</MenuItem>
              <MenuItem value="MINOR_REVISION">Minor Revision</MenuItem>
              <MenuItem value="MAJOR_REVISION">Major Revision</MenuItem>
              <MenuItem value="REJECT">Reject</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            name="comments"
            label="Comments"
            multiline
            rows={4}
            fullWidth
            value={reviewData.comments}
            onChange={handleChange}
            disabled={selectedReview?.status === 'COMPLETED'}
            sx={{ mt: 2 }}
          />

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Scores (1-10)
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="qualityScore"
                label="Quality Score"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                fullWidth
                value={reviewData.qualityScore}
                onChange={handleChange}
                disabled={selectedReview?.status === 'COMPLETED'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="originalityScore"
                label="Originality Score"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                fullWidth
                value={reviewData.originalityScore}
                onChange={handleChange}
                disabled={selectedReview?.status === 'COMPLETED'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="clarityScore"
                label="Clarity Score"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                fullWidth
                value={reviewData.clarityScore}
                onChange={handleChange}
                disabled={selectedReview?.status === 'COMPLETED'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="significanceScore"
                label="Significance Score"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                fullWidth
                value={reviewData.significanceScore}
                onChange={handleChange}
                disabled={selectedReview?.status === 'COMPLETED'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedReview?.status !== 'COMPLETED' && (
            <Button onClick={handleSubmitReview} variant="contained">
              Submit Review
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ReviewerDashboard;
