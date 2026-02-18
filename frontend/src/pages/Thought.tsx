import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import type { Thought, ThoughtDetail } from '../types';

const Thought = () => {
  const { id } = useParams<{ id: string }>();
  const thoughtId = id ? parseInt(id, 10) : 0;
  const apiClient = useApiClient();
  const { isAuthenticated } = useAuth0();

  const [thought, setThought] = useState<Thought | null>(null);
  const [details, setDetails] = useState<ThoughtDetail[]>([]);
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

  return (
    <Box>
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
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ flex: 1, pr: 2 }}>
          {thought.description || 'Untitled Thought'}
        </Typography>
        {thought.thoughtDate && (
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', mt: 0.5 }}>
            {formatDate(thought.thoughtDate)}
          </Typography>
        )}
      </Box>

      {/* Details as Elevated Cards */}
      {details.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No details available for this thought.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {details.map((detail) => (
            <Paper key={detail.id} elevation={2} sx={{ p: 2 }}>
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
    </Box>
  );
};

export default Thought;

