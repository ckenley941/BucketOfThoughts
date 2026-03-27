import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshThoughtBuckets } from '../hooks';
import type { ThoughtBucket, ThoughtModule } from '../types';

const ThoughtBucketForm = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const currentBucketId = isEditMode && id ? parseInt(id, 10) : undefined;
  const { isAuthenticated } = useAuth0();

  const [formData, setFormData] = useState<Partial<ThoughtBucket>>({
    description: '',
    thoughtModuleId: 0,
    parentId: undefined,
    sortOrder: 0,
    showOnDashboard: true,
  });
  const [thoughtModules, setThoughtModules] = useState<ThoughtModule[]>([]);
  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      if (!isAuthenticated) {
        setOptionsLoading(false);
        return;
      }

      setOptionsLoading(true);
      setError(null);
      try {
        const [modulesRes, bucketsRes] = await Promise.all([
          apiClient.get<ThoughtModule[]>('api/thoughtmodules'),
          apiClient.get<ThoughtBucket[]>('api/thoughtbuckets'),
        ]);
        if (!cancelled) {
          setThoughtModules(modulesRes.data);
          setThoughtBuckets(bucketsRes.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load thought modules or buckets',
          );
        }
      } finally {
        if (!cancelled) {
          setOptionsLoading(false);
        }
      }
    };

    loadOptions();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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

  const parentBucketOptions = thoughtBuckets
    .filter((b) => b.id !== currentBucketId)
    .slice()
    .sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }));

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
      setError('Please select a thought module.');
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

  const pageLoading = optionsLoading || (isEditMode && fetching);

  if (pageLoading) {
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
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="thought-module-label" shrink>
            Thought module
          </InputLabel>
          <Select
            labelId="thought-module-label"
            label="Thought module"
            value={formData.thoughtModuleId && formData.thoughtModuleId > 0 ? formData.thoughtModuleId : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                thoughtModuleId: Number(e.target.value),
              })
            }
          >
            <MenuItem value="">
              <em>Select a module</em>
            </MenuItem>
            {thoughtModules.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-bucket-label" shrink>
            Parent bucket
          </InputLabel>
          <Select
            labelId="parent-bucket-label"
            label="Parent bucket"
            displayEmpty
            value={formData.parentId ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setFormData({
                ...formData,
                parentId: v === '' ? undefined : Number(v),
              });
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {parentBucketOptions.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
