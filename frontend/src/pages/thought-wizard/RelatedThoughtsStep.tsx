import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { forwardRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../../services/api';
import type { Thought, RelatedThought } from '../../types';
import ThoughtCard from '../../components/ThoughtCard';

export interface RelatedThoughtsStepHandle {
  save: () => Promise<void>;
}

interface RelatedThoughtsStepProps {
  thoughtId: number;
}

const RelatedThoughtsStep = forwardRef<RelatedThoughtsStepHandle, RelatedThoughtsStepProps>(
  ({ thoughtId }, ref) => {
    const apiClient = useApiClient();
    const { isAuthenticated } = useAuth0();
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [relatedThoughts, setRelatedThoughts] = useState<RelatedThought[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
      save: async () => {
        // No save needed - changes are saved immediately when adding
        return Promise.resolve();
      },
    }));

    // Fetch all thoughts for the grid
    useEffect(() => {
      const fetchThoughts = async () => {
        if (!isAuthenticated) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);
          const response = await apiClient.get<Thought[]>('api/thoughts');
          setThoughts(response.data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred while fetching thoughts');
        } finally {
          setLoading(false);
        }
      };

      fetchThoughts();
    }, [isAuthenticated, apiClient]);

    // Fetch related thoughts
    const fetchRelatedThoughts = useCallback(async () => {
      if (!isAuthenticated || !thoughtId) {
        setLoadingRelated(false);
        return;
      }

      try {
        setLoadingRelated(true);
        setError(null);
        const response = await apiClient.get<RelatedThought[]>(`api/relatedthoughts/thought/${thoughtId}`);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setRelatedThoughts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching related thoughts');
      } finally {
        setLoadingRelated(false);
      }
    }, [isAuthenticated, thoughtId, apiClient]);

    useEffect(() => {
      fetchRelatedThoughts();
    }, [fetchRelatedThoughts]);

    const handleAddRelatedThought = async (relatedThoughtId: number) => {
      if (!isAuthenticated || !thoughtId) {
        return;
      }

      try {
        setAdding(relatedThoughtId);
        setError(null);

        // Check if already related
        const alreadyRelated = relatedThoughts.some(rt => rt.relatedThoughtId === relatedThoughtId);
        if (alreadyRelated) {
          setError('This thought is already related.');
          setAdding(null);
          return;
        }

        // Don't allow relating to itself
        if (relatedThoughtId === thoughtId) {
          setError('A thought cannot be related to itself.');
          setAdding(null);
          return;
        }

        // Call POST endpoint
        await apiClient.post('api/relatedthoughts', {
          parentThoughtId: thoughtId,
          relatedThoughtId: relatedThoughtId,
        });

        // Refresh the related thoughts list
        await fetchRelatedThoughts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while adding related thought');
      } finally {
        setAdding(null);
      }
    };

    const handleDeleteRelatedThought = async (relatedThoughtId: number) => {
      if (!isAuthenticated || !thoughtId) {
        return;
      }

      try {
        setError(null);

        // Find the RelatedThought record ID
        const relatedThought = relatedThoughts.find(rt => rt.relatedThoughtId === relatedThoughtId);
        if (!relatedThought) {
          setError('Related thought not found.');
          return;
        }

        // Call DELETE endpoint
        await apiClient.delete(`api/relatedthoughts/${relatedThought.id}`);

        // Refresh the related thoughts list
        await fetchRelatedThoughts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while deleting related thought');
      }
    };

    const formatDate = (dateString?: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch {
        return dateString;
      }
    };

    // Filter out thoughts that are already related
    const availableThoughts = thoughts.filter(
      thought => 
        thought.id !== thoughtId && 
        !relatedThoughts.some(rt => rt.relatedThoughtId === thought.id)
    );

    // DataGrid columns
    const columns: GridColDef<Thought>[] = [
      {
        field: 'thoughtDate',
        headerName: 'Thought Date',
        flex: 1,
        minWidth: 150,
        valueGetter: (value: unknown) => value ? formatDate(value as string) : '',
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'bucket',
        headerName: 'Bucket',
        flex: 1,
        minWidth: 150,
        valueGetter: (_value: unknown, row: Thought) => row.bucket?.description || '',
      },
      {
        field: 'actions',
        headerName: '',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<Thought>) => {
          const thoughtId = params.row.id;
          const isAdding = adding === thoughtId;
          
          return (
            <Tooltip title="Add as related thought">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddRelatedThought(thoughtId);
                }}
                disabled={isAdding}
                color="primary"
              >
                {isAdding ? <CircularProgress size={20} /> : <AddIcon />}
              </IconButton>
            </Tooltip>
          );
        },
      },
    ];

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Related Thoughts
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Top Section: Grid of available thoughts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Available Thoughts
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={availableThoughts}
              columns={columns}
              getRowId={(row: Thought) => row.id}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              sx={{
                '& .MuiDataGrid-row': {
                  cursor: 'default',
                },
              }}
            />
          </Box>
        </Box>

        {/* Bottom Section: List of related thoughts */}
        <Box>
          <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Related Thoughts ({relatedThoughts.length})
          </Typography>
          
          {loadingRelated ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : relatedThoughts.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No related thoughts yet. Use the grid above to add related thoughts.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {relatedThoughts.map((relatedThought) => (
                relatedThought.relatedThought && (
                  <ThoughtCard
                    key={relatedThought.id}
                    thought={relatedThought.relatedThought}
                    allowDelete={true}
                    handleDelete={() => handleDeleteRelatedThought(relatedThought.relatedThoughtId)}
                  />
                )
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
);

RelatedThoughtsStep.displayName = 'RelatedThoughtsStep';

export default RelatedThoughtsStep;
