import {
  Box,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import type { Thought } from '../types';
import ThoughtCard from '../components/ThoughtCard';

type ViewMode = 'grid' | 'card';

const ThoughtsPage = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [cardPage, setCardPage] = useState<number>(1);
  const [cardPageSize, setCardPageSize] = useState<number>(12);
  const [filteredThoughts, setFilteredThoughts] = useState<Thought[]>([]);
  
  // Get filter values from URL params
  const filterBucket = searchParams.get('bucketId') || '';
  const filterDescription = searchParams.get('search') || '';

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
  }, [isAuthenticated, getAccessTokenSilently]);

  // Apply filters when thoughts or filter params change
  useEffect(() => {
    let filtered = [...thoughts];

    // Filter by bucket
    if (filterBucket) {
      const bucketId = parseInt(filterBucket, 10);
      filtered = filtered.filter((thought) => thought.bucket?.id === bucketId);
    }

    // Filter by description
    if (filterDescription.trim()) {
      const searchText = filterDescription.trim().toLowerCase();
      filtered = filtered.filter((thought) =>
        thought.description?.toLowerCase().includes(searchText)
      );
    }

    setFilteredThoughts(filtered);
    setCardPage(1); // Reset to first page when filtering
  }, [thoughts, filterBucket, filterDescription]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

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
  ];

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value as ViewMode);
              if (e.target.value === 'card') {
                setCardPage(1); // Reset to first page when switching to card view
              }
            }}
          >
            <FormControlLabel value="card" control={<Radio />} label="Card" />
            <FormControlLabel value="grid" control={<Radio />} label="Grid" />
          </RadioGroup>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-label">Per Page</InputLabel>
          <Select
            labelId="page-size-label"
            id="page-size-select"
            value={cardPageSize}
            label="Per Page"
            onChange={(e) => {
              setCardPageSize(Number(e.target.value));
              setCardPage(1); // Reset to first page when page size changes
            }}
          >
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={18}>18</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {thoughts.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No thoughts yet. Add your first thought!
        </Typography>
      ) : viewMode === 'grid' ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredThoughts}
            columns={columns}
            getRowId={(row: Thought) => row.id}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            onRowClick={(params: GridRowParams<Thought>) => navigate(`/thought/${params.row.id}`)}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
        </Box>
      ) : (
        <Box>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
              mb: 3,
            }}
          >
            {filteredThoughts
              .slice((cardPage - 1) * cardPageSize, cardPage * cardPageSize)
              .map((thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  onClick={() => navigate(`/thought/${thought.id}`)}
                />
              ))}
          </Box>

          {filteredThoughts.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              No thoughts match your search criteria.
            </Typography>
          ) : (
            Math.ceil(filteredThoughts.length / cardPageSize) > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.ceil(filteredThoughts.length / cardPageSize)}
                  page={cardPage}
                  onChange={(_, value) => setCardPage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default ThoughtsPage;

