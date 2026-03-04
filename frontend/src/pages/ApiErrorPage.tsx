import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';

const ApiErrorPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate('/home');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          API Service Unavailable
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          We're sorry, but we're unable to connect to our API service at the moment.
          This could be due to maintenance or a temporary service interruption.
          Please try again in a few moments.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          size="large"
        >
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default ApiErrorPage;
