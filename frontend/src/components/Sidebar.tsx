import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import type { RecentThought } from '../types';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiClient = useApiClient();
  const { isAuthenticated } = useAuth0();
  const [recentThoughts, setRecentThoughts] = useState<RecentThought[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentThoughts = async () => {
      if (!isAuthenticated) {
        setRecentThoughts([]);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get<RecentThought[]>('api/thoughts/recent');
        setRecentThoughts(response.data);
      } catch (err) {
        console.error('Error fetching recent thoughts:', err);
        setRecentThoughts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentThoughts();

    // Listen for refresh events
    const handleRefresh = () => {
      fetchRecentThoughts();
    };

    window.addEventListener('recentThoughts:refresh', handleRefresh);

    return () => {
      window.removeEventListener('recentThoughts:refresh', handleRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px', // Account for AppBar height
        },
      }}
    >
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, px: 2 }}>
          Recent Thoughts
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentThoughts.length === 0 ? (
          <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
            No recent thoughts
          </Typography>
        ) : (
          <List>
            {recentThoughts.map((thought, index) => (
              <Box key={thought.id}>
                {index > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === `/thought/${thought.id}`}
                    onClick={() => navigate(`/thought/${thought.id}`)}
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 1.5,
                      '& .MuiListItemText-primary': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        mt: 0.5,
                      },
                    }}
                  >
                    {thought.bucket && (
                      <Chip
                        label={thought.bucket}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                    <ListItemText
                      primary={thought.description || `Thought #${thought.id}`}
                      primaryTypographyProps={{
                        variant: 'body2',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;





