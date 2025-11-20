import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { apiClient } from '../services/api';
import type { Thought, ApiResponse } from '../types';

const Thoughts = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThoughts = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const response = await apiClient.get<ApiResponse<Thought>>(
          'api/thoughts',
          token
        );

        console.log(response);

        if (response.isSuccess) {
          setThoughts(response.results);
        } else {
          setError(response.errorMessage || 'Failed to fetch thoughts');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching thoughts');
      } finally {
        setLoading(false);
      }
    };

    fetchThoughts();
  }, [isAuthenticated, getAccessTokenSilently]);

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
        <Typography variant="h4" component="h1" gutterBottom>
          All Thoughts
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Thoughts
      </Typography>
      {thoughts.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No thoughts yet. Add your first thought!
        </Typography>
      ) : (
        <List>
          {thoughts.map((thought) => (
            <ListItem key={thought.id} disablePadding>
              <ListItemButton onClick={() => navigate(`/thought/${thought.id}`)}>
                <ListItemText
                  primary={thought.description || `Thought #${thought.id}`}
                  secondary={thought.textType}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Thoughts;

