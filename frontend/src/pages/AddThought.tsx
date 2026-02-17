import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshRecentThoughts } from '../hooks';
import type { Thought, ThoughtBucket } from '../types';

const AddThought = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [textType, setTextType] = useState('PlainText');
  const [showOnDashboard, setShowOnDashboard] = useState(true);
  const [thoughtDate, setThoughtDate] = useState<string>('');
  const [selectedBucket, setSelectedBucket] = useState<ThoughtBucket | null>(null);
  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);

  const { isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThoughtBuckets = async () => {
      if (!isAuthenticated) {
        setLoadingBuckets(false);
        return;
      }

      try {
        setLoadingBuckets(true);
        const response = await apiClient.get<ThoughtBucket[]>('api/thoughtbuckets');
        setThoughtBuckets(response.data);
        if (response.data.length > 0 && !selectedBucket) {
          setSelectedBucket(response.data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching thought buckets');
      } finally {
        setLoadingBuckets(false);
      }
    };

    fetchThoughtBuckets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to add a thought.');
      return;
    }

    if (!description || !description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!selectedBucket) {
      setError('Please select a thought bucket.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Thought> = {
        description: description.trim(),
        textType: textType || 'PlainText',
        showOnDashboard: showOnDashboard,
        thoughtDate: thoughtDate || undefined,
        bucket: {
          id: selectedBucket.id,
          description: selectedBucket.description,
          thoughtModuleId: selectedBucket.thoughtModuleId,
          parentId: selectedBucket.parentId,
          sortOrder: selectedBucket.sortOrder,
          showOnDashboard: selectedBucket.showOnDashboard,
        },
        details: [],
        websiteLinks: [],
      };

      const response = await apiClient.post<Thought>('api/thoughts', payload);
      if (response.data.id > 0) {
        // Refresh recent thoughts in sidebar
        refreshRecentThoughts();
        navigate('/thoughts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding the thought');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add a New Thought
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" sx={{ mt: 3, maxWidth: 600 }}>
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Thought Bucket</InputLabel>
          <Select
            value={selectedBucket?.id || ''}
            label="Thought Bucket"
            onChange={(e) => {
              const bucketId = e.target.value as number;
              const bucket = thoughtBuckets.find(b => b.id === bucketId);
              setSelectedBucket(bucket || null);
            }}
            disabled={loadingBuckets}
          >
            {loadingBuckets ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : thoughtBuckets.length === 0 ? (
              <MenuItem disabled>No thought buckets available</MenuItem>
            ) : (
              thoughtBuckets.map((bucket) => (
                <MenuItem key={bucket.id} value={bucket.id}>
                  {bucket.description || `Bucket #${bucket.id}`}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Text Type"
          value={textType}
          onChange={(e) => setTextType(e.target.value)}
          margin="normal"
          helperText="Default: PlainText"
        />
        <TextField
          fullWidth
          label="Thought Date"
          type="date"
          value={thoughtDate}
          onChange={(e) => setThoughtDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Leave empty to use current date"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showOnDashboard}
              onChange={(e) => setShowOnDashboard(e.target.checked)}
            />
          }
          label="Show on Dashboard"
          sx={{ mt: 2 }}
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || loadingBuckets}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Thought'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/thoughts')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddThought;





