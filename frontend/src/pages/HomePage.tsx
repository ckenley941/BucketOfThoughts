import {
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSearchParams } from 'react-router-dom';
import { useApiClient } from '../services/api';
import { useThoughtBuckets } from '../hooks';
import ThoughtPage from './ThoughtPage';
import type { Thought } from '../types';

const HomePage = () => {
  const { isAuthenticated } = useAuth0();
  const apiClient = useApiClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { thoughtBuckets, loading: loadingBuckets } = useThoughtBuckets();
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [randomThought, setRandomThought] = useState<Thought | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoLoaded = useRef(false);

  const handleBucketChange = (event: { target: { value: string } }) => {
    setSelectedBucket(event.target.value);
    setRandomThought(null); // Clear previous thought when bucket changes
  };

  const handleRandomThought = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to get a random thought.');
      return;
    }

    setLoading(true);
    setError(null);
    setRandomThought(null);

    try {
      const bucketId = selectedBucket && selectedBucket !== '' ? parseInt(selectedBucket, 10) : undefined;
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
    if (shouldAutoFetch && isAuthenticated && !loadingBuckets) {
      // Remove the query parameter
      setSearchParams({}, { replace: true });
      // Trigger random thought fetch
      handleRandomThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isAuthenticated, loadingBuckets]);

  // Auto-fetch random thought on first load
  useEffect(() => {
    if (isAuthenticated && !loadingBuckets && !hasAutoLoaded.current) {
      hasAutoLoaded.current = true;
      handleRandomThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loadingBuckets]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Random Thought
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="bucket-select-label">Bucket</InputLabel>
          <Select
            labelId="bucket-select-label"
            id="bucket-select"
            value={selectedBucket}
            label="Bucket"
            onChange={handleBucketChange}
            disabled={loadingBuckets || loading}
          >
            <MenuItem value="">
              <em>All Buckets</em>
            </MenuItem>
            {thoughtBuckets.map((bucket) => (
              <MenuItem key={bucket.id} value={bucket.id.toString()}>
                {bucket.description || `Bucket #${bucket.id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Tooltip title="Random Thought">
          <IconButton
            color="primary"
            onClick={handleRandomThought}
            disabled={loading || loadingBuckets}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : <ShuffleIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {randomThought && (
        <Box sx={{ mt: 3 }}>
          <ThoughtPage thoughtId={randomThought.id} />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
