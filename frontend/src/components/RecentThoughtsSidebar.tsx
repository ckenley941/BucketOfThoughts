import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
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
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import type { RecentThought } from '../types';

const drawerWidth = 240;
const collapsedWidth = 64;

/** Full description in a tooltip only when the one-line label is truncated (ellipsis). */
function TruncatedOneLineWithTooltip({
  text,
  variant = 'body2',
  sx,
}: {
  text: string;
  variant?: 'body2' | 'caption';
  sx?: SxProps<Theme>;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      // Flex items default to min-width: auto; without minWidth:0 on ancestors scrollWidth === clientWidth.
      setTruncated(el.scrollWidth > el.clientWidth + 0.5);
    };

    const run = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(measure);
      });
    };

    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    window.addEventListener('resize', run);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', run);
    };
  }, [text]);

  const typography = (
    <Typography
      ref={textRef}
      variant={variant}
      component="span"
      noWrap
      sx={{
        display: 'block',
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...sx,
      }}
    >
      {text}
    </Typography>
  );

  return (
    <Tooltip
      title={text}
      placement="left-start"
      enterDelay={400}
      disableHoverListener={!truncated}
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 420,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        },
      }}
    >
      {typography}
    </Tooltip>
  );
}

const getStatusLabel = (status: string | number | undefined): string => {
  if (status === undefined || status === null || status === '') return '';
  
  // Handle numeric enum values (0 = Added, 1 = Viewed, 2 = Random)
  if (status === 0 || status === '0') return 'Added';
  if (status === 1 || status === '1') return 'Viewed';
  if (status === 2 || status === '2') return 'Random';
  
  // Handle string enum values
  const statusStr = String(status).toLowerCase().trim();
  if (statusStr === 'added') return 'Added';
  if (statusStr === 'viewed') return 'Viewed';
  if (statusStr === 'random') return 'Random';
  
  // Fallback: capitalize first letter if it's a valid status
  return statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
};

const getStatusColor = (status: string | number | undefined): 'success' | 'info' | 'warning' => {
  if (status === undefined || status === null || status === '') return 'warning';
  
  // Handle numeric enum values (0 = Added, 1 = Viewed, 2 = Random)
  if (status === 0 || status === '0') return 'success';
  if (status === 1 || status === '1') return 'info';
  if (status === 2 || status === '2') return 'warning';
  
  // Handle string enum values
  const statusStr = String(status).toLowerCase().trim();
  if (statusStr === 'added') return 'success';
  if (statusStr === 'viewed') return 'info';
  return 'warning'; // Random or unknown
};

interface RecentThoughtsSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const RecentThoughtsSidebar = ({ mobileOpen, onMobileClose }: RecentThoughtsSidebarProps) => {
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
            Recent Memory
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
          <List sx={{ width: '100%', minWidth: 0, py: 0 }}>
            {recentThoughts.map((thought, index) => {
              const description = thought.description ?? '';
              const collapsedPreview = description
                ? description.substring(0, 10) + (description.length > 10 ? '...' : '')
                : `#${thought.id}`;
              const collapsedNeedsTooltip = Boolean(description && description.length > 10);

              const collapsedCaption = (
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
                  {collapsedPreview}
                </Typography>
              );

              return (
                <Box key={thought.id}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding sx={{ minWidth: 0, width: '100%' }}>
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
                        minWidth: 0,
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      {collapsed && !isMobile ? (
                        collapsedNeedsTooltip ? (
                          <Tooltip
                            title={description}
                            placement="right"
                            enterDelay={400}
                            slotProps={{
                              tooltip: {
                                sx: {
                                  maxWidth: 420,
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                },
                              },
                            }}
                          >
                            <span style={{ display: 'block', width: '100%', textAlign: 'center' }}>{collapsedCaption}</span>
                          </Tooltip>
                        ) : (
                          collapsedCaption
                        )
                      ) : (
                        <>
                          <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5, flexWrap: 'wrap', maxWidth: '100%' }}>
                            {thought.bucket && (
                              <Chip
                                label={thought.bucket.description}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            )}
                            {(thought.status !== undefined && thought.status !== null && thought.status !== '') && (
                              <Chip
                                label={getStatusLabel(thought.status)}
                                color={getStatusColor(thought.status)}
                                size="small"
                                variant="filled"
                              />
                            )}
                          </Box>
                          <Box sx={{ width: '100%', minWidth: 0, mt: 0.5 }}>
                            <TruncatedOneLineWithTooltip
                              text={thought.description || `Thought #${thought.id}`}
                              sx={{
                                textAlign: 'left',
                              }}
                            />
                          </Box>
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                </Box>
              );
            })}
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

export default RecentThoughtsSidebar;
