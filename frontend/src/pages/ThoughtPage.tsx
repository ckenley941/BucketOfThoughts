import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshRecentThoughts } from '../hooks';
import type { Thought, ThoughtDetail, ThoughtWebsiteLink, RelatedThought } from '../types';
import LinkIcon from '@mui/icons-material/Link';
import JsonThoughtDetailsGrid from '../components/JsonThoughtDetailsGrid';
import ThoughtCard from '../components/ThoughtCard';

interface ThoughtProps {
  thoughtId?: number;
  isRandom?: boolean;
}

const ThoughtPage = (props?: ThoughtProps) => {
  const { thoughtId: propThoughtId, isRandom = false } = props || {};
  const { id } = useParams<{ id: string }>();
  const routeThoughtId = id ? parseInt(id, 10) : 0;
  const thoughtId = propThoughtId ?? routeThoughtId;
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const [thought, setThought] = useState<Thought | null>(null);
  const [details, setDetails] = useState<ThoughtDetail[]>([]);
  const [websiteLinks, setWebsiteLinks] = useState<ThoughtWebsiteLink[]>([]);
  const [relatedThoughts, setRelatedThoughts] = useState<RelatedThought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !thoughtId) {
      setLoading(false);
      return;
    }

    const fetchThought = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch thought
        const thoughtResponse = await apiClient.get<Thought>(
          `api/thoughts/${thoughtId}`
        );
        console.log('Fetched thought:', thoughtResponse.data);
        // Handle array response - get first element
        const thoughtData = Array.isArray(thoughtResponse.data) 
          ? thoughtResponse.data[0] 
          : thoughtResponse.data;
        setThought(thoughtData);

        // Fetch details
        const detailsResponse = await apiClient.get<ThoughtDetail[]>(
          `api/thoughtdetails/thought/${thoughtId}`
        );
        setDetails(detailsResponse.data.sort((a, b) => a.sortOrder - b.sortOrder));

        // Fetch website links
        const linksResponse = await apiClient.get<ThoughtWebsiteLink[]>(
          `api/thoughtwebsitelinks/thought/${thoughtId}`
        );
        setWebsiteLinks(linksResponse.data.sort((a, b) => a.sortOrder - b.sortOrder));

        // Fetch related thoughts
        const relatedResponse = await apiClient.get<RelatedThought[]>(
          `api/relatedthoughts/thought/${thoughtId}`
        );
        const relatedData = Array.isArray(relatedResponse.data) ? relatedResponse.data : [relatedResponse.data];
        setRelatedThoughts(relatedData);

        // Mark thought as viewed (skip if this is a random thought)
        if (!isRandom) {
          try {
            await apiClient.post(`api/thoughts/${thoughtId}/viewed`);
            // Refresh recent thoughts after marking as viewed
            refreshRecentThoughts();
          } catch (viewErr) {
            // Silently fail - viewing is not critical
            console.error('Failed to mark thought as viewed:', viewErr);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching the thought'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchThought();
  }, [isAuthenticated, thoughtId, apiClient]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!thought) {
    return (
      <Box>
        <Alert severity="warning">Thought not found</Alert>
      </Box>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Only show back button when accessed via route (not when used as a component from HomePage)
  const isEmbedded = propThoughtId !== undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Back Button - Only show when not embedded (i.e., accessed via route) */}
      {!isEmbedded && (
        <Box sx={{ mb: -2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/thoughts')}
            variant="outlined"
            size="small"
          >
            Back to Thoughts
          </Button>
        </Box>
      )}

      {/* Thought Section */}
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Tooltip title="Edit Thought">
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/thought-wizard?thoughtId=${thoughtId}&step=0`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Category (Bucket) */}
        {thought.bucket && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={thought.bucket.description}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Header with Description and Date */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ flex: 1, pr: 2 }}>
            {thought.description || 'Untitled Thought'}
          </Typography>
          {thought.thoughtDate && (
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', mt: 0.5 }}>
              {formatDate(thought.thoughtDate)}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Details Section */}
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Tooltip title="Edit Details">
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/thought-wizard?thoughtId=${thoughtId}&step=1`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {details.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No details
            </Typography>
          </Box>
        ) : thought.textType === 'Json' ? (
          <JsonThoughtDetailsGrid details={details} />
        ) : (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {details.map((detail) => (
              <Paper key={detail.id} elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 60, fontWeight: 'medium' }}
                  >
                    #{detail.sortOrder}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flex: 1 }}>
                    {detail.description || '(No description)'}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      {/* Website Links Section */}
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Tooltip title="Edit Website Links">
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/thought-wizard?thoughtId=${thoughtId}&step=2`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {websiteLinks.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No website links
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {websiteLinks.map((link) => (
              <Paper key={`${link.thoughtId}-${link.websiteLinkId}`} elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LinkIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontWeight: 'medium' }}
                    >
                      #{link.sortOrder}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="a"
                      href={link.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        display: 'block',
                        mb: 0.5,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.websiteUrl}
                    </Typography>
                    {link.description && (
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      {/* Related Thoughts Section */}
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Tooltip title="Edit Related Thoughts">
            <IconButton
              color="primary"
              size="small"
              onClick={() => navigate(`/thought-wizard?thoughtId=${thoughtId}&step=3`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {relatedThoughts.length === 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No related thoughts 
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {relatedThoughts.map((relatedThought) => (
              relatedThought.relatedThought && (
                <ThoughtCard
                  key={relatedThought.id}
                  thought={relatedThought.relatedThought}
                  allowDelete={false}
                  onClick={() => navigate(`/thought/${relatedThought.relatedThoughtId}`)}
                />
              )
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ThoughtPage;
