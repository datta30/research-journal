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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Logout,
  AssignmentInd,
  FactCheck,
  Insights,
  Refresh,
  RocketLaunch,
  AutoAwesome,
  PictureAsPdf,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { editorAPI } from '../services/api';
import PageContainer from '../components/design/PageContainer';
import GlassCard from '../components/design/GlassCard';
import { motion } from 'framer-motion';
import { openPdfBlob } from '../utils/pdf';

const EditorDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [unassignedPapers, setUnassignedPapers] = useState([]);
  const [myPapers, setMyPapers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openReviewerDialog, setOpenReviewerDialog] = useState(false);
  const [openDecisionDialog, setOpenDecisionDialog] = useState(false);
  const [openReviewsDialog, setOpenReviewsDialog] = useState(false);
  const [paperReviews, setPaperReviews] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [tabValue]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tabValue === 0) {
        const response = await editorAPI.getUnassignedPapers();
        setUnassignedPapers(response.data);
      } else {
        const response = await editorAPI.getMyPapers();
        setMyPapers(response.data);
      }
      const reviewersRes = await editorAPI.getAvailableReviewers();
      setReviewers(reviewersRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAssignToMe = async (paperId) => {
    try {
      await editorAPI.assignPaperToMe(paperId);
      setSuccess('Paper assigned successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to assign paper');
    }
  };

  const handleOpenReviewerDialog = (paper) => {
    setSelectedPaper(paper);
    setOpenReviewerDialog(true);
  };

  const handleAssignReviewer = async () => {
    try {
      await editorAPI.assignReviewer(selectedPaper.id, selectedReviewer);
      setSuccess('Reviewer assigned successfully!');
      setOpenReviewerDialog(false);
      setSelectedReviewer('');
      fetchData();
    } catch (err) {
      setError(err.response?.data || 'Failed to assign reviewer');
    }
  };

  const handleOpenDecisionDialog = (paper) => {
    setSelectedPaper(paper);
    setOpenDecisionDialog(true);
  };

  const handleMakeDecision = async () => {
    try {
      await editorAPI.makeFinalDecision(selectedPaper.id, decision, comments);
      setSuccess('Decision made successfully!');
      setOpenDecisionDialog(false);
      setDecision('');
      setComments('');
      fetchData();
    } catch (err) {
      setError('Failed to make decision');
    }
  };

  const handleOpenReviewsDialog = async (paper) => {
    setSelectedPaper(paper);
    setOpenReviewsDialog(true);
    try {
      const response = await editorAPI.getPaperReviews(paper.id);
      setPaperReviews(response.data);
    } catch (err) {
      setError('Failed to fetch reviews');
      setPaperReviews([]);
    }
  };

  const handleViewPaper = async (paperId, paperTitle) => {
    try {
      const response = await editorAPI.downloadPaper(paperId);
      openPdfBlob(response.data, `${paperTitle}.pdf`);
    } catch (err) {
      setError('Failed to open paper');
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

  const summary = useMemo(() => {
    const awaitingDecision = myPapers.filter((paper) => ['REVISION_REQUIRED', 'REVISED'].includes(paper.status)).length;
    const published = myPapers.filter((paper) => paper.status === 'PUBLISHED').length;

    return {
      unassigned: unassignedPapers.length,
      active: myPapers.length,
      awaitingDecision,
      published,
    };
  }, [myPapers, unassignedPapers]);

  const statCards = [
    {
      label: 'Unassigned queue',
      value: summary.unassigned,
      helper: 'Awaiting editorial leadership',
      icon: <AssignmentInd fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(34,211,238,0.28), rgba(129,140,248,0.28))',
    },
    {
      label: 'My active papers',
      value: summary.active,
      helper: 'Currently under your direction',
      icon: <FactCheck fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(14,165,233,0.24))',
    },
    {
      label: 'Awaiting decision',
      value: summary.awaitingDecision,
      helper: 'Need your editorial verdict',
      icon: <Insights fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(251,191,36,0.35), rgba(248,113,113,0.28))',
    },
    {
      label: 'Recently published',
      value: summary.published,
      helper: 'Celebrated outcomes',
      icon: <Insights fontSize="small" />,
      color: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(56,189,248,0.24))',
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
        initial={{ opacity: 0.12, scale: 0.9 }}
        animate={{ opacity: [0.12, 0.26, 0.16], scale: [0.94, 1.04, 0.98] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          inset: '-85px',
          background:
            'radial-gradient(circle at 20% 15%, rgba(56,189,248,0.24), transparent 60%), ' +
            'radial-gradient(circle at 78% 30%, rgba(129,140,248,0.24), transparent 65%)',
          filter: 'blur(140px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ rotate: 8, opacity: 0 }}
        animate={{ rotate: 0, opacity: 0.6 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          position: 'absolute',
          top: { xs: -150, md: -170 },
          left: { xs: -90, md: -120 },
          width: { xs: 240, md: 340 },
          height: { xs: 240, md: 340 },
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22), transparent 60%)',
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
                label="Editor nexus"
                sx={{
                  backgroundColor: 'rgba(34, 197, 94, 0.22)',
                  borderRadius: 999,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(220, 252, 231, 0.95)',
                  fontWeight: 600,
                  px: 2,
                }}
              />
              <Stack direction="row" spacing={0.5} alignItems="center" color="rgba(244, 244, 245, 0.72)">
                <AutoAwesome fontSize="small" />
                <Typography variant="caption" sx={{ letterSpacing: '0.08em' }}>
                  Decision velocity
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
              Editorial command center
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 540 }}>
              Coordinate reviews, deliver decisions, and elevate manuscripts with cinematic clarity across every stage of publication.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchData}
              size="large"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              Refresh pipeline
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
                  boxShadow: '0 32px 75px rgba(15, 23, 42, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.2), transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.45s ease',
                  },
                  '&:hover::after': {
                    opacity: 0.4,
                  },
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.12, 0.3, 0.16], scale: [0.92, 1.06, 0.99] }}
                  transition={{ duration: 11 + index * 3, repeat: Infinity, ease: 'easeInOut' }}
                  sx={{
                    position: 'absolute',
                    inset: '-55%',
                    background: 'radial-gradient(circle, rgba(34,197,94,0.32), transparent 62%)',
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

  const activePapers = tabValue === 0 ? unassignedPapers : myPapers;
  const isUnassignedView = tabValue === 0;

  return (
    <PageContainer hero={hero} align="stretch">
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
          initial={{ opacity: 0.1, y: 15 }}
          animate={{ opacity: 0.2, y: [15, 0, 10] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            inset: '-130px',
            background: 'radial-gradient(circle at 80% 30%, rgba(34,197,94,0.18), transparent 65%)',
            filter: 'blur(130px)',
            pointerEvents: 'none',
          }}
        />
        <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Typography variant="h4">Paper Management</Typography>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{ alignSelf: { xs: 'stretch', md: 'flex-end' } }}
            >
              <Tab label="Unassigned Papers" />
              <Tab label="My Papers" />
            </Tabs>
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
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Submitted</TableCell>
                    {!isUnassignedView && <TableCell>Status</TableCell>}
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activePapers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isUnassignedView ? 4 : 5} align="center" sx={{ py: 6 }}>
                        <Typography variant="h6" gutterBottom>
                          {isUnassignedView ? 'All caught up!' : 'No papers under your management yet'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {isUnassignedView
                            ? 'When new submissions arrive, stage them here for reviewer assignment.'
                            : 'Grab manuscripts from the unassigned queue to build your portfolio.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activePapers.map((paper, index) => (
                      <TableRow
                        key={paper.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.04 }}
                        sx={{ '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' } }}
                      >
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {paper.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            Submitted {new Date(paper.submittedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {paper.author?.firstName} {paper.author?.lastName}
                        </TableCell>
                        <TableCell>{new Date(paper.submittedAt).toLocaleDateString()}</TableCell>
                        {!isUnassignedView && (
                          <TableCell>
                            <Chip
                              label={paper.status.replace(/_/g, ' ')}
                              color={getStatusColor(paper.status)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        )}
                        <TableCell align="right">
                          {isUnassignedView ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PictureAsPdf fontSize="small" />}
                                onClick={() => handleViewPaper(paper.id, paper.title)}
                              >
                                View PDF
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleAssignToMe(paper.id)}
                              >
                                Assign to me
                              </Button>
                            </Stack>
                          ) : (
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PictureAsPdf fontSize="small" />}
                                onClick={() => handleViewPaper(paper.id, paper.title)}
                              >
                                View PDF
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenReviewsDialog(paper)}
                              >
                                View reviews
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenReviewerDialog(paper)}
                              >
                                Assign reviewer
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleOpenDecisionDialog(paper)}
                              >
                                Make decision
                              </Button>
                            </Stack>
                          )}
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

      {/* Assign Reviewer Dialog */}
        <Dialog open={openReviewerDialog} onClose={() => setOpenReviewerDialog(false)}>
          <DialogTitle>Assign Reviewer</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Reviewer</InputLabel>
              <Select
                value={selectedReviewer}
                onChange={(e) => setSelectedReviewer(e.target.value)}
                label="Select Reviewer"
              >
                {reviewers.map((reviewer) => (
                  <MenuItem key={reviewer.id} value={reviewer.id}>
                    {reviewer.firstName} {reviewer.lastName} ({reviewer.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReviewerDialog(false)}>Cancel</Button>
            <Button onClick={handleAssignReviewer} variant="contained">
              Assign
            </Button>
          </DialogActions>
        </Dialog>

        {/* Make Decision Dialog */}
        <Dialog open={openDecisionDialog} onClose={() => setOpenDecisionDialog(false)}>
          <DialogTitle>Make Final Decision</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Decision</InputLabel>
              <Select
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                label="Decision"
              >
                <MenuItem value="ACCEPTED">Accept</MenuItem>
                <MenuItem value="REJECTED">Reject</MenuItem>
                <MenuItem value="REVISION_REQUIRED">Revision Required</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Comments"
              multiline
              rows={4}
              fullWidth
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDecisionDialog(false)}>Cancel</Button>
            <Button onClick={handleMakeDecision} variant="contained">
              Submit Decision
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Reviews Dialog */}
        <Dialog open={openReviewsDialog} onClose={() => setOpenReviewsDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Reviews for "{selectedPaper?.title}"
          </DialogTitle>
          <DialogContent>
            {paperReviews.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No reviews submitted yet for this paper.
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                {paperReviews.map((review, index) => (
                  <GlassCard key={review.id} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Review #{index + 1} by {review.reviewer?.firstName} {review.reviewer?.lastName}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status: <Chip label={review.status.replace(/_/g, ' ')} size="small" sx={{ ml: 1 }} />
                      </Typography>
                      {review.assignedAt && (
                        <Typography variant="body2" color="text.secondary">
                          Assigned: {new Date(review.assignedAt).toLocaleDateString()}
                        </Typography>
                      )}
                      {review.completedAt && (
                        <Typography variant="body2" color="text.secondary">
                          Completed: {new Date(review.completedAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>

                    {review.recommendation && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Recommendation:
                        </Typography>
                        <Chip 
                          label={review.recommendation.replace(/_/g, ' ')} 
                          color={
                            review.recommendation === 'ACCEPT' ? 'success' :
                            review.recommendation === 'REJECT' ? 'error' :
                            'warning'
                          }
                        />
                      </Box>
                    )}

                    {review.comments && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Comments:
                        </Typography>
                        <Typography variant="body2">
                          {review.comments}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {review.qualityScore && (
                        <Typography variant="body2">
                          Quality: {review.qualityScore}/10
                        </Typography>
                      )}
                      {review.originalityScore && (
                        <Typography variant="body2">
                          Originality: {review.originalityScore}/10
                        </Typography>
                      )}
                      {review.clarityScore && (
                        <Typography variant="body2">
                          Clarity: {review.clarityScore}/10
                        </Typography>
                      )}
                      {review.significanceScore && (
                        <Typography variant="body2">
                          Significance: {review.significanceScore}/10
                        </Typography>
                      )}
                    </Box>
                  </GlassCard>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenReviewsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
  );
};

export default EditorDashboard;
