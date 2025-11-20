import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Box,
  Button,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface NavbarProps {
  showSearch?: boolean;
}

const Navbar = ({ showSearch = true }: NavbarProps) => {
  const [bucket, setBucket] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const handleBucketChange = (event: SelectChangeEvent<string>) => {
    setBucket(event.target.value);
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchText, 'in bucket:', bucket);
  };

  const handleAddThought = () => {
    navigate('/add-thought');
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin + '/login',
      },
    });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Bucket of Thoughts
        </Typography>
        {showSearch && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
            <Select
              value={bucket}
              onChange={handleBucketChange}
              displayEmpty
              sx={{
                minWidth: 120,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              }}
            >
              <MenuItem value="">
                <em>Buckets</em>
              </MenuItem>
              {/* TODO: Add actual bucket options */}
            </Select>
            <TextField
              placeholder="Search thoughts..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              sx={{
                flexGrow: 1,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <IconButton color="inherit" onClick={handleAddThought}>
              <Add />
            </IconButton>
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

