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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, Add, List as ListIcon, Menu as MenuIcon, Shuffle as ShuffleIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useThoughtBuckets } from '../hooks';

interface NavbarProps {
  showSearch?: boolean;
  onMenuClick?: () => void;
}

const Navbar = ({ showSearch = true, onMenuClick }: NavbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [bucket, setBucket] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth0();
  const { thoughtBuckets, loading: loadingBuckets } = useThoughtBuckets();

  const handleBucketChange = (event: SelectChangeEvent<string>) => {
    setBucket(event.target.value);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText && searchText.trim()) {
      params.set('search', searchText.trim());
    }
    if (bucket && bucket !== '') {
      params.set('bucketId', bucket);
    }
    const queryString = params.toString();
    navigate(`/thoughts${queryString ? `?${queryString}` : ''}`);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setBucket('');
    // If on thoughts page, navigate to clear URL filters and refresh the data
    if (location.pathname === '/thoughts') {
      navigate('/thoughts', { replace: true });
    }
  };

  const handleAddThought = () => {
    navigate('/thought-wizard', { replace: true });
  };

  const handleThoughts = () => {
    navigate('/thoughts');
  };

  const handleRandomThought = () => {
    const params = new URLSearchParams();
    params.set('random', 'true');
    if (bucket && bucket !== '') {
      params.set('bucketId', bucket);
    }
    navigate(`/home?${params.toString()}`);
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

  const handleHome = () => {
    navigate('/');
  };

  const userDisplayName = user?.name || user?.email || 'User';
  const isUserMenuOpen = Boolean(anchorEl);

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: { xs: 1, md: 0 } }}>
        {isMobile && onMenuClick && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component="div"
          onClick={handleHome}
          sx={{
            flexGrow: { xs: 1, md: 0 },
            mr: { xs: 0, md: 4 },
            fontSize: { xs: '1rem', md: '1.25rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {isMobile ? 'BoT' : 'Bucket of Thoughts'}
        </Typography>
        {showSearch && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 1 },
              gap: { xs: 0.5, md: 1 },
              width: { xs: '100%', md: 'auto' },
              order: { xs: 3, md: 0 },
              mt: { xs: 1, md: 0 },
            }}
          >
            {!isMobile && (
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
            )}
            {!isMobile && (
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
                      {(bucket || searchText) && (
                        <IconButton
                          onClick={handleClearFilters}
                          edge="end"
                          size="small"
                          sx={{ mr: 0.5 }}
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={handleSearch} edge="end">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 0.5 } }}>
              <Tooltip title="Add Thought">
                <IconButton color="inherit" onClick={handleAddThought} size={isMobile ? 'small' : 'medium'}>
                  <Add />
                </IconButton>
              </Tooltip>
              <Tooltip title="All Thoughts">
                <IconButton color="inherit" onClick={handleThoughts} size={isMobile ? 'small' : 'medium'}>
                  <ListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Random Thought">
                <IconButton color="inherit" onClick={handleRandomThought} size={isMobile ? 'small' : 'medium'}>
                  <ShuffleIcon />
                </IconButton>
              </Tooltip>
              {isMobile ? (
                <IconButton
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  size="small"
                  aria-controls={isUserMenuOpen ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen ? 'true' : undefined}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                    {userDisplayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </Typography>
                </IconButton>
              ) : (
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
              )}
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
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

