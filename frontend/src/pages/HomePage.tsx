import {
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSearchParams } from 'react-router-dom';
import { useApiClient } from '../services/api';
import ThoughtPage from './ThoughtPage';
import type { Thought } from '../types';

const HomePage = () => {
  const { isAuthenticated } = useAuth0();
  const apiClient = useApiClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [randomThought, setRandomThought] = useState<Thought | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoLoaded = useRef(false);

  const handleRandomThought = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to get a random thought.');
      return;
    }

    setLoading(true);
    setError(null);
    setRandomThought(null);

    try {
      const bucketIdParam = searchParams.get('bucketId');
      const bucketId = bucketIdParam ? parseInt(bucketIdParam, 10) : undefined;
      const url = bucketId 
        ? `api/thoughts/random?bucketId=${bucketId}`
        : 'api/thoughts/random';
      
      const response = await apiClient.get<Thought>(url);
      const thoughtData = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      setRandomThought(thoughtData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching a random thought'
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch random thought if ?random=true is in URL
  useEffect(() => {
    const shouldAutoFetch = searchParams.get('random') === 'true';
    if (shouldAutoFetch && isAuthenticated) {
      // Remove the random query parameter but keep bucketId if present
      const newParams = new URLSearchParams();
      const bucketId = searchParams.get('bucketId');
      if (bucketId) {
        newParams.set('bucketId', bucketId);
      }
      setSearchParams(newParams, { replace: true });
      // Trigger random thought fetch
      handleRandomThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated]);

  // Auto-fetch random thought on first load
  useEffect(() => {
    if (isAuthenticated && !hasAutoLoaded.current) {
      hasAutoLoaded.current = true;
      handleRandomThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {randomThought && (
        <ThoughtPage thoughtId={randomThought.id} />
      )}
    </Box>
  );
};

export default HomePage;
