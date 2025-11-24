import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const LoginNavbar = () => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bucket of Thoughts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/about')}>
            About
          </Button>
          <Button color="inherit" onClick={() => navigate('/demo')}>
            Demo
          </Button>
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LoginNavbar;




