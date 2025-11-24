import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshThoughtBuckets } from '../hooks';
import type { ThoughtBucket } from '../types';

const ThoughtBucketForm = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { isAuthenticated } = useAuth0();

  const [formData, setFormData] = useState<Partial<ThoughtBucket>>({
    description: '',
    thoughtModuleId: 0,
    parentId: undefined,
    sortOrder: 0,
    showOnDashboard: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThoughtBucket = async () => {
      if (!isEditMode || !isAuthenticated) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        setError(null);
        const response = await apiClient.get<ThoughtBucket>(`api/thoughtbuckets/${id}`);
        setFormData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the thought bucket');
      } finally {
        setFetching(false);
      }
    };

    fetchThoughtBucket();
  }, [id, isEditMode, isAuthenticated]);

  const handleSubmit = async () => {
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to save a thought bucket.');
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!formData.thoughtModuleId || formData.thoughtModuleId <= 0) {
      setError('Thought Module ID must be greater than 0.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<ThoughtBucket> = {
        description: formData.description,
        thoughtModuleId: formData.thoughtModuleId,
        parentId: formData.parentId,
        sortOrder: formData.sortOrder || 0,
        showOnDashboard: formData.showOnDashboard ?? true,
      };

      if (isEditMode && id) {
        payload.id = parseInt(id, 10);
        await apiClient.put<ThoughtBucket>(`api/thoughtbuckets`, payload);
      } else {
        await apiClient.post<ThoughtBucket>('api/thoughtbuckets', payload);
      }

      // Refresh buckets in navbar and other components
      refreshThoughtBuckets();

      navigate('/thought-buckets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the thought bucket');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/thought-buckets');
  };

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? 'Edit Thought Bucket' : 'Add New Thought Bucket'}
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
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          required
          inputProps={{ maxLength: 256 }}
        />
        <TextField
          fullWidth
          label="Thought Module ID"
          type="number"
          value={formData.thoughtModuleId || ''}
          onChange={(e) => setFormData({ ...formData, thoughtModuleId: parseInt(e.target.value, 10) || 0 })}
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />
        <TextField
          fullWidth
          label="Parent ID (Optional)"
          type="number"
          value={formData.parentId || ''}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({
              ...formData,
              parentId: value ? parseInt(value, 10) : undefined,
            });
          }}
          margin="normal"
          inputProps={{ min: 1 }}
        />
        <TextField
          fullWidth
          label="Sort Order"
          type="number"
          value={formData.sortOrder || 0}
          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
          margin="normal"
          inputProps={{ min: 0 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.showOnDashboard ?? true}
              onChange={(e) => setFormData({ ...formData, showOnDashboard: e.target.checked })}
            />
          }
          label="Show on Dashboard"
          sx={{ mt: 2 }}
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : isEditMode ? 'Update' : 'Create'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ThoughtBucketForm;

