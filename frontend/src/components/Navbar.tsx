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
  Menu,
  Tooltip,
} from '@mui/material';
import { Search, Add, List as ListIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useThoughtBuckets } from '../hooks';

interface NavbarProps {
  showSearch?: boolean;
}

const Navbar = ({ showSearch = true }: NavbarProps) => {
  const [bucket, setBucket] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth0();
  const { thoughtBuckets, loading: loadingBuckets } = useThoughtBuckets();

  const handleBucketChange = (event: SelectChangeEvent<string>) => {
    setBucket(event.target.value);
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchText, 'in bucket:', bucket);
  };

  const handleAddThought = () => {
    navigate('/thought-wizard');
  };

  const handleThoughts = () => {
    navigate('/thoughts');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout({
      logoutParams: {
        returnTo: window.location.origin + '/login',
      },
    });
  };

  const handleBuckets = () => {
    handleUserMenuClose();
    navigate('/thought-buckets');
  };

  const handleAbout = () => {
    handleUserMenuClose();
    navigate('/about');
  };

  const userDisplayName = user?.name || user?.email || 'User';
  const isUserMenuOpen = Boolean(anchorEl);

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
              disabled={loadingBuckets}
              sx={{
                minWidth: 120,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              }}
            >
              <MenuItem value="">
                <em>All Buckets</em>
              </MenuItem>
              {thoughtBuckets.map((thoughtBucket) => (
                <MenuItem key={thoughtBucket.id} value={thoughtBucket.id.toString()}>
                  {thoughtBucket.description || `Bucket #${thoughtBucket.id}`}
                </MenuItem>
              ))}
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
            <Tooltip title="Add Thought">
              <IconButton color="inherit" onClick={handleAddThought}>
                <Add />
              </IconButton>
            </Tooltip>
            <Tooltip title="Thoughts">
              <IconButton color="inherit" onClick={handleThoughts}>
                <ListIcon />
              </IconButton>
            </Tooltip>
            <Button
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ ml: 2 }}
              aria-controls={isUserMenuOpen ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? 'true' : undefined}
            >
              {userDisplayName}
            </Button>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={isUserMenuOpen}
              onClose={handleUserMenuClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
              }}
            >
              <MenuItem onClick={handleBuckets}>Buckets</MenuItem>
              <MenuItem onClick={handleAbout}>About</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

