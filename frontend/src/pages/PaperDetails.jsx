import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack, PictureAsPdf, Description } from '@mui/icons-material';
import { publicAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { openPdfBlob } from '../utils/pdf';

const PaperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaperDetails();
  }, [id]);

  const fetchPaperDetails = async () => {
    try {
      const response = await publicAPI.getPaper(id);
      const paperData = response.data;
      
      // Only allow viewing of published papers in public view
      if (paperData.status !== 'PUBLISHED' && !user) {
        setError('This paper is not publicly available');
        return;
      }
      
      setPaper(paperData);
    } catch (err) {
      setError('Failed to fetch paper details: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    try {
      const response = await publicAPI.downloadPaper(id);
      openPdfBlob(response.data, paper.originalFileName || `${paper.title}.pdf`);
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

  const getPlagiarismColor = (status) => {
    const colors = {
      PASSED: 'success',
      FLAGGED: 'error',
      REQUIRES_REVIEW: 'warning',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/papers')} sx={{ mt: 2 }}>
          Back to Papers
        </Button>
      </Container>
    );
  }

  if (!paper) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Paper not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/papers')} sx={{ mt: 2 }}>
          Back to Papers
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/papers')} sx={{ mb: 3 }}>
        Back to Papers
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {paper.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={paper.status.replace(/_/g, ' ')}
                color={getStatusColor(paper.status)}
              />
              <Chip label={`Version ${paper.currentVersion}`} variant="outlined" />
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={handleOpenPdf}
          >
            View PDF
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {/* Paper Information */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Abstract
            </Typography>
            <Typography variant="body1" paragraph>
              {paper.abstractText}
            </Typography>

            {paper.keywords && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Keywords
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {paper.keywords.split(',').map((keyword, index) => (
                    <Chip key={index} label={keyword.trim()} size="small" />
                  ))}
                </Box>
              </>
            )}

            {/* Only show editor comments and reviews to authenticated users */}
            {user && paper.editorComments && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Editor Comments
                </Typography>
                <Alert severity="info">{paper.editorComments}</Alert>
              </>
            )}

            {/* Reviews Section - Only visible to authenticated users */}
            {user && paper.reviews && paper.reviews.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Reviews
                </Typography>
                {paper.reviews.map((review, index) => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">
                          Review #{index + 1}
                        </Typography>
                        <Chip
                          label={review.recommendation}
                          color={review.recommendation === 'ACCEPT' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.comments}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Revisions Section - Only visible to authenticated users */}
            {user && paper.revisions && paper.revisions.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Revision History
                </Typography>
                <List>
                  {paper.revisions.map((revision) => (
                    <ListItem key={revision.id}>
                      <ListItemText
                        primary={`Version ${revision.versionNumber}`}
                        secondary={`${new Date(revision.submittedAt).toLocaleDateString()} - ${revision.changesSummary}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Grid>

          {/* Side Panel */}
          <Grid item xs={12} md={4}>
            {/* Metadata */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metadata
                </Typography>
                <List dense>
                  {paper.author && (
                    <ListItem>
                      <ListItemText
                        primary="Author"
                        secondary={`${paper.author.firstName} ${paper.author.lastName}`}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText
                      primary="Submitted"
                      secondary={new Date(paper.submittedAt || paper.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Last Updated"
                      secondary={new Date(paper.updatedAt).toLocaleDateString()}
                    />
                  </ListItem>
                  {paper.publishedAt && (
                    <ListItem>
                      <ListItemText
                        primary="Published"
                        secondary={new Date(paper.publishedAt).toLocaleDateString()}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText
                      primary="File"
                      secondary={paper.originalFileName}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Plagiarism Check - Only visible to authenticated users */}
            {user && paper.plagiarismCheck && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Plagiarism Check
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={paper.plagiarismCheck.status}
                      color={getPlagiarismColor(paper.plagiarismCheck.status)}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h4" color="primary">
                      {paper.plagiarismCheck.similarityScore.toFixed(2)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Similarity Score
                    </Typography>
                  </Box>
                  {paper.plagiarismCheck.remarks && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      {paper.plagiarismCheck.remarks}
                    </Alert>
                  )}
                  {paper.plagiarismCheck.matchedSources && (
                    <>
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Matched Sources
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {paper.plagiarismCheck.matchedSources}
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    Checked: {new Date(paper.plagiarismCheck.checkedAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PaperDetails;
