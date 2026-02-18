import {
  Box,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../../services/api';
import type { ThoughtDetail } from '../../types';

interface LocalThoughtDetail extends Omit<ThoughtDetail, 'id'> {
  id: number | string;
  isNew?: boolean;
  isExpanded?: boolean;
}

export interface DetailsStepHandle {
  save: () => Promise<void>;
  getDetails: () => LocalThoughtDetail[];
}

interface DetailsStepProps {
  thoughtId: number;
  onDetailsChange?: (details: LocalThoughtDetail[]) => void;
}

const DetailsStep = forwardRef<DetailsStepHandle, DetailsStepProps>(
  ({ thoughtId, onDetailsChange }, ref) => {
    const apiClient = useApiClient();
    const { isAuthenticated } = useAuth0();
    const [details, setDetails] = useState<LocalThoughtDetail[]>([]);
    const [originalDetailIds, setOriginalDetailIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextTempId, setNextTempId] = useState(-1);

    useEffect(() => {
      if (!isAuthenticated || !thoughtId) {
        setLoading(false);
        return;
      }

      const fetchDetails = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get<ThoughtDetail[]>(
            `api/thoughtdetails/thought/${thoughtId}`
          );
          const loadedDetails = response.data.map((d) => ({
            ...d,
            isExpanded: false,
          }));
          setDetails(loadedDetails);
          setOriginalDetailIds(response.data.map((d) => d.id));
          if (onDetailsChange) {
            onDetailsChange(loadedDetails);
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : 'An error occurred while fetching thought details'
          );
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }, [isAuthenticated, thoughtId, apiClient, onDetailsChange]);

    const handleAddDetail = () => {
      const newDetail: LocalThoughtDetail = {
        id: nextTempId,
        description: '',
        thoughtId: thoughtId,
        sortOrder:
          details.length > 0 ? Math.max(...details.map((d) => d.sortOrder)) + 1 : 1,
        isNew: true,
        isExpanded: true,
      };
      const updatedDetails = [...details, newDetail];
      setDetails(updatedDetails);
      setNextTempId(nextTempId - 1);
      if (onDetailsChange) {
        onDetailsChange(updatedDetails);
      }
    };

    const handleUpdateDetail = (
      id: number | string,
      field: keyof LocalThoughtDetail,
      value: any
    ) => {
      const updatedDetails = details.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail
      );
      setDetails(updatedDetails);
      if (onDetailsChange) {
        onDetailsChange(updatedDetails);
      }
    };

    const handleDeleteDetail = (id: number | string) => {
      const updatedDetails = details.filter((detail) => detail.id !== id);
      setDetails(updatedDetails);
      if (onDetailsChange) {
        onDetailsChange(updatedDetails);
      }
    };

    const handleToggleExpand = (id: number | string) => {
      const updatedDetails = details.map((detail) =>
        detail.id === id
          ? { ...detail, isExpanded: !detail.isExpanded }
          : detail
      );
      setDetails(updatedDetails);
      if (onDetailsChange) {
        onDetailsChange(updatedDetails);
      }
    };

    const handleSaveAll = async () => {
      setError(null);
      if (!isAuthenticated) {
        setError('You must be logged in to save thought details.');
        throw new Error('You must be logged in to save thought details.');
      }

      // Filter out invalid details (no description or sort order <= 0)
      const validDetails = details.filter(
        (d) => d.description.trim() && d.sortOrder > 0
      );

      // Remove invalid details from state
      if (validDetails.length !== details.length) {
        setDetails(validDetails);
        if (onDetailsChange) {
          onDetailsChange(validDetails);
        }
      }

      // If no valid details, just return
      if (validDetails.length === 0) {
        return;
      }

      setSaving(true);
      try {
        // Find details that were deleted
        const currentDetailIds = validDetails
          .filter((d) => !d.isNew)
          .map((d) => d.id as number);
        const deletedDetailIds = originalDetailIds.filter(
          (id) => !currentDetailIds.includes(id)
        );

        // Delete removed details
        const deletePromises = deletedDetailIds.map((id) =>
          apiClient.delete(`api/thoughtdetails/${id}`)
        );

        // Save all valid details
        const savePromises = validDetails.map(async (detail) => {
          const payload: Partial<ThoughtDetail> = {
            description: detail.description.trim(),
            thoughtId: detail.thoughtId,
            sortOrder: detail.sortOrder,
          };

          if (detail.isNew) {
            await apiClient.post<ThoughtDetail>('api/thoughtdetails', payload);
          } else {
            payload.id = detail.id as number;
            await apiClient.put<ThoughtDetail>('api/thoughtdetails', payload);
          }
        });

        await Promise.all([...deletePromises, ...savePromises]);

        // Reload details to get updated IDs
        const response = await apiClient.get<ThoughtDetail[]>(
          `api/thoughtdetails/thought/${thoughtId}`
        );
        const reloadedDetails = response.data.map((d) => ({
          ...d,
          isExpanded: false,
        }));
        setDetails(reloadedDetails);
        setOriginalDetailIds(response.data.map((d) => d.id));
        if (onDetailsChange) {
          onDetailsChange(reloadedDetails);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while saving thought details'
        );
        throw err;
      } finally {
        setSaving(false);
      }
    };

    // Expose save function via ref
    useImperativeHandle(ref, () => ({
      save: handleSaveAll,
      getDetails: () => details,
    }));

    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <IconButton
            color="primary"
            onClick={handleAddDetail}
            disabled={saving}
            title="Add Detail"
          >
            <AddIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {details.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ typography: 'body1', color: 'text.secondary' }}>
              No details yet. Click the + icon to add a detail.
            </Box>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {details
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((detail) => (
                <Paper key={detail.id} sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: detail.isExpanded ? 2 : 0,
                    }}
                  >
                    <TextField
                      label="Sort Order"
                      type="number"
                      value={detail.sortOrder}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value) && value > 0) {
                          handleUpdateDetail(detail.id, 'sortOrder', value);
                        }
                      }}
                      inputProps={{ min: 1 }}
                      sx={{ width: 120 }}
                      size="small"
                      error={detail.sortOrder <= 0}
                      helperText={
                        detail.sortOrder <= 0 ? 'Must be greater than 0' : ''
                      }
                    />
                    <Box sx={{ flex: 1 }}>
                      {detail.isExpanded ? (
                        <TextField
                          fullWidth
                          label="Description"
                          value={detail.description}
                          onChange={(e) =>
                            handleUpdateDetail(detail.id, 'description', e.target.value)
                          }
                          multiline
                          rows={4}
                          size="small"
                        />
                      ) : (
                        <Box
                          sx={{
                            typography: 'body2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleToggleExpand(detail.id)}
                        >
                          {detail.description || '(No description)'}
                        </Box>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleExpand(detail.id)}
                      title={detail.isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {detail.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteDetail(detail.id)}
                      title="Delete Detail"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
          </Box>
        )}
      </Box>
    );
  }
);

DetailsStep.displayName = 'DetailsStep';

export default DetailsStep;
