import { Box, Typography, Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Bucket of Thoughts
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Please log in to continue
      </Typography>
      <Button variant="contained" size="large" onClick={handleLogin}>
        Log In
      </Button>
    </Box>
  );
};

export default Login;

