import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshThoughtBuckets } from '../hooks';
import type { ThoughtBucket } from '../types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ThoughtBuckets = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThoughtBuckets = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<ThoughtBucket[]>('api/thoughtbuckets');
        setThoughtBuckets(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching thought buckets');
      } finally {
        setLoading(false);
      }
    };

    fetchThoughtBuckets();
  }, [isAuthenticated]);

  const handleDelete = async (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this thought bucket?')) {
      return;
    }

    try {
      await apiClient.delete(`api/thoughtbuckets/${id}`);
      setThoughtBuckets(thoughtBuckets.filter(tb => tb.id !== id));
      // Refresh buckets in navbar
      refreshThoughtBuckets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the thought bucket');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Thought Buckets
          </Typography>
          <IconButton
            color="primary"
            onClick={() => navigate('/thought-buckets/add')}
            title="Add Thought Bucket"
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Thought Buckets
        </Typography>
        <IconButton
          color="primary"
          onClick={() => navigate('/thought-buckets/add')}
          title="Add Thought Bucket"
        >
          <AddIcon />
        </IconButton>
      </Box>

      {thoughtBuckets.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No thought buckets yet. Add your first thought bucket!
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {thoughtBuckets.map((bucket) => (
            <Card
              key={bucket.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(`/thought-buckets/${bucket.id}`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {bucket.description || `Bucket #${bucket.id}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Module ID: {bucket.thoughtModuleId}
                </Typography>
                {bucket.parentId && (
                  <Typography variant="body2" color="text.secondary">
                    Parent ID: {bucket.parentId}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Sort Order: {bucket.sortOrder}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Show on Dashboard: {bucket.showOnDashboard ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/thought-buckets/${bucket.id}`);
                  }}
                >
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => handleDelete(bucket.id, e)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ThoughtBuckets;

