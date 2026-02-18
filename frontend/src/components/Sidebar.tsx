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
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import type { RecentThought } from '../types';

const drawerWidth = 240;
const collapsedWidth = 64;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const apiClient = useApiClient();
  const { isAuthenticated } = useAuth0();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [recentThoughts, setRecentThoughts] = useState<RecentThought[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!collapsed && (
          <Typography variant="h6" sx={{ px: 1, flex: 1 }}>
            Recent Thoughts
          </Typography>
        )}
        {!isMobile && (
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <IconButton
              size="small"
              onClick={() => setCollapsed(!collapsed)}
              sx={{ ml: collapsed ? 0 : 1 }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ overflow: 'auto', flex: 1, p: collapsed && !isMobile ? 1 : 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentThoughts.length === 0 ? (
          (!collapsed || isMobile) && (
            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
              No recent thoughts
            </Typography>
          )
        ) : (
          <List>
            {recentThoughts.map((thought, index) => (
              <Box key={thought.id}>
                {index > 0 && <Divider />}
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === `/thought/${thought.id}`}
                    onClick={() => {
                      navigate(`/thought/${thought.id}`);
                      if (isMobile && onMobileClose) {
                        onMobileClose();
                      }
                    }}
                    sx={{
                      flexDirection: collapsed && !isMobile ? 'column' : 'column',
                      alignItems: collapsed && !isMobile ? 'center' : 'flex-start',
                      justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                      py: collapsed && !isMobile ? 1.5 : 1.5,
                      px: collapsed && !isMobile ? 0.5 : 1,
                      minHeight: collapsed && !isMobile ? 56 : 'auto',
                      '& .MuiListItemText-primary': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        mt: collapsed && !isMobile ? 0 : 0.5,
                        textAlign: collapsed && !isMobile ? 'center' : 'left',
                      },
                    }}
                    title={collapsed && !isMobile ? (thought.description || `Thought #${thought.id}`) : undefined}
                  >
                    {collapsed && !isMobile ? (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.65rem',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                          lineHeight: 1.2,
                        }}
                      >
                        {thought.description
                          ? thought.description.substring(0, 10) + (thought.description.length > 10 ? '...' : '')
                          : `#${thought.id}`}
                      </Typography>
                    ) : (
                      <>
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
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen || false}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            marginTop: '64px',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;





