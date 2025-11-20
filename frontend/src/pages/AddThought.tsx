import { Typography, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { apiClient } from '../services/api';
import type { ServiceResponse, Thought } from '../types';

const AddThought = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to add a thought.');
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });

      const payload = {
        description: title,
        textType: content,
      };

      const response = await apiClient.post<ServiceResponse<Thought>>( 'api/thoughts', payload, token );

      if (response.isSuccess) {
        navigate('/thoughts');
      } else {
        setError(response.errorMessage || 'Failed to add thought');
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
      <Box component="form" sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={10}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Thought'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddThought;

