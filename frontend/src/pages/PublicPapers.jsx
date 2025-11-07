import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AutoAwesome, RocketLaunch, PictureAsPdf, Visibility, Login } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import PageContainer from '../components/design/PageContainer';
import GlassCard from '../components/design/GlassCard';
import { openPdfBlob } from '../utils/pdf';

const PublicPapers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const motionVariants = useMemo(() => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  }), []);

  useEffect(() => {
    fetchPublishedPapers();
  }, []);

  const fetchPublishedPapers = async () => {
    try {
      const response = await publicAPI.getPublishedPapers();
      setPapers(response.data);
    } catch (err) {
      setError('Failed to fetch published papers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPaper = async (paperId, paperTitle) => {
    try {
      const response = await publicAPI.downloadPaper(paperId);
      openPdfBlob(response.data, `${paperTitle}.pdf`);
    } catch (err) {
      setError('Failed to open paper');
    }
  };

  const handleViewDetails = (paperId) => {
    navigate(`/papers/${paperId}`);
  };

  const hero = (
    <GlassCard
      component={motion.div}
      variants={motionVariants}
      initial="initial"
      animate="animate"
      sx={{
        px: { xs: 4, md: 6 },
        py: { xs: 5, md: 7 },
        overflow: 'visible',
      }}
    >
      <Stack spacing={3}>
        <Chip
          icon={<AutoAwesome sx={{ color: '#facc15' }} />}
          label="Discover the frontier of modern research"
          sx={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#c7d2fe',
            backdropFilter: 'blur(8px)',
          }}
        />
        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          Immersive Research Library
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '72ch' }}>
          Explore peer-reviewed publications curated by our global community of scholars.
          Experience a new dimension of academic discovery with immersive visuals, fluid
          interactions, and lightning-fast access to knowledge.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            size="large"
            startIcon={<RocketLaunch />}
            component={RouterLink}
            to="/login"
            sx={{ minWidth: 200 }}
          >
            Launch Portal
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<Login />}
            component={RouterLink}
            to="/register"
            sx={{ minWidth: 200 }}
          >
            Join Community
          </Button>
        </Stack>
      </Stack>
    </GlassCard>
  );

  return (
    <PageContainer hero={hero} align="stretch">
      {error && <Alert severity="error" sx={{ mb: 4, alignSelf: 'stretch' }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress size={72} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {papers.length === 0 ? (
            <Grid item xs={12}>
              <GlassCard sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  No published papers just yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Check back soon to discover groundbreaking research from our contributors.
                </Typography>
              </GlassCard>
            </Grid>
          ) : (
            papers.map((paper, index) => (
              <Grid item xs={12} md={6} lg={4} key={paper.id}>
                <GlassCard
                  component={motion.div}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.6 }}
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 3,
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label="Published"
                        color="success"
                        sx={{ fontWeight: 700 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(paper.publishedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ minHeight: 90 }}>
                      {paper.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ minHeight: 96 }}>
                      {paper.abstractText?.substring(0, 180) || 'No abstract available.'}
                      {paper.abstractText && paper.abstractText.length > 180 ? '…' : ''}
                    </Typography>
                    <Divider flexItem light>
                      <Chip
                        size="small"
                        label={`${paper.author?.firstName || ''} ${paper.author?.lastName || ''}`.trim() || 'Anonymous'}
                        sx={{
                          backgroundColor: 'rgba(14, 165, 233, 0.2)',
                          color: '#e0f2fe',
                        }}
                      />
                    </Divider>
                    <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                      {(paper.keywords?.split(',') || ['Research']).map((keyword) => (
                        <Chip
                          key={keyword.trim()}
                          label={keyword.trim()}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            color: '#dbeafe',
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        File
                      </Typography>
                      <Typography variant="subtitle2">
                        {paper.originalFileName || `${paper.title}.pdf`}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View full paper insights">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(paper.id)}
                          size="large"
                          sx={{
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.24)' },
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open PDF viewer">
                        <IconButton
                          color="secondary"
                          onClick={() => handleViewPaper(paper.id, paper.title)}
                          size="large"
                          sx={{
                            backgroundColor: 'rgba(34, 211, 238, 0.14)',
                            '&:hover': { backgroundColor: 'rgba(34, 211, 238, 0.28)' },
                          }}
                        >
                          <PictureAsPdf />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </GlassCard>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </PageContainer>
  );
};

export default PublicPapers;
