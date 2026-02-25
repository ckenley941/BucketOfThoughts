import {
  Box,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../../services/api';
import type { ThoughtDetail, JsonDetail } from '../../types';

interface LocalThoughtDetail extends Omit<ThoughtDetail, 'id'> {
  id: number | string;
  isNew?: boolean;
  isExpanded?: boolean;
}

interface JsonTableData {
  columns: string[];
  rows: Record<string, string>[];
}

export interface DetailsStepHandle {
  save: () => Promise<void>;
  getDetails: () => LocalThoughtDetail[];
}

interface DetailsStepProps {
  thoughtId: number;
  textType?: string;
  onDetailsChange?: (details: LocalThoughtDetail[]) => void;
}

const DetailsStep = forwardRef<DetailsStepHandle, DetailsStepProps>(
  ({ thoughtId, textType = 'PlainText', onDetailsChange }, ref) => {
    const apiClient = useApiClient();
    const { isAuthenticated } = useAuth0();
    const [details, setDetails] = useState<LocalThoughtDetail[]>([]);
    const [originalDetailIds, setOriginalDetailIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextTempId, setNextTempId] = useState(-1);
    const [draggedDetailId, setDraggedDetailId] = useState<number | string | null>(null);
    
    // Json table state
    const [jsonTableData, setJsonTableData] = useState<JsonTableData>({
      columns: [],
      rows: [],
    });

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
          
          if (textType === 'Json') {
            // Parse Json type: first detail (sortOrder 1) has column names, second (sortOrder 2) has JSON
            const sortedDetails = [...response.data].sort((a, b) => a.sortOrder - b.sortOrder);
            const headerDetail = sortedDetails.find((d) => d.sortOrder === 1);
            const jsonDetail = sortedDetails.find((d) => d.sortOrder === 2);
            
            if (headerDetail && jsonDetail) {
              const columns = headerDetail.description.split('|').filter((c) => c.trim());
              let rows: Record<string, string>[] = [];
              
              try {
                const jsonData = JSON.parse(jsonDetail.description);
                if (Array.isArray(jsonData)) {
                  rows = jsonData.map((row: Record<string, string>) => {
                    const newRow: Record<string, string> = {};
                    columns.forEach((col, index) => {
                      // Map back from actual column names to Column1, Column2, etc.
                      const columnKey = `Column${index + 1}`;
                      newRow[columnKey] = row[col] || '';
                    });
                    return newRow;
                  });
                }
              } catch (e) {
                // If JSON parsing fails, start with empty rows
                rows = [];
              }
              
              setJsonTableData({ columns, rows });
              setDetails([headerDetail, jsonDetail]);
              setOriginalDetailIds([headerDetail.id, jsonDetail.id]);
            } else {
              // No existing data, initialize empty
              setJsonTableData({ columns: [], rows: [] });
              setDetails([]);
              setOriginalDetailIds([]);
            }
          } else {
            // PlainText type
            const loadedDetails = response.data.map((d) => ({
              ...d,
              isExpanded: false,
            }));
            setDetails(loadedDetails);
            setOriginalDetailIds(response.data.map((d) => d.id));
          }
          
          if (onDetailsChange) {
            const loadedDetails = response.data.map((d) => ({
              ...d,
              isExpanded: false,
            }));
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
    }, [isAuthenticated, thoughtId, textType, apiClient, onDetailsChange]);

    const handleAddDetail = () => {
      if (textType === 'Json') {
        // Add a new row to the table
        const newRow: Record<string, string> = {};
        jsonTableData.columns.forEach((_, index) => {
          newRow[`Column${index + 1}`] = '';
        });
        setJsonTableData({
          ...jsonTableData,
          rows: [...jsonTableData.rows, newRow],
        });
      } else {
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
      }
    };

    const handleAddColumn = () => {
      if (jsonTableData.columns.length >= 12) {
        setError('Maximum of 12 columns allowed');
        return;
      }
      const newColumnIndex = jsonTableData.columns.length + 1;
      const newColumnName = `Column${newColumnIndex}`;
      const updatedColumns = [...jsonTableData.columns, newColumnName];
      const updatedRows = jsonTableData.rows.map((row) => ({
        ...row,
        [`Column${newColumnIndex}`]: '',
      }));
      setJsonTableData({
        columns: updatedColumns,
        rows: updatedRows,
      });
    };

    const handleUpdateColumnName = (index: number, newName: string) => {
      const updatedColumns = [...jsonTableData.columns];
      updatedColumns[index] = newName;
      setJsonTableData({
        ...jsonTableData,
        columns: updatedColumns,
      });
    };

    const handleDeleteColumn = (index: number) => {
      const updatedColumns = jsonTableData.columns.filter((_, i) => i !== index);
      const updatedRows = jsonTableData.rows.map((row) => {
        // Rebuild row with correct Column1, Column2, etc. keys
        const reorderedRow: Record<string, string> = {};
        updatedColumns.forEach((_, newIndex) => {
          // Get value from the original column position
          const originalIndex = newIndex < index ? newIndex : newIndex + 1;
          const originalKey = `Column${originalIndex + 1}`;
          reorderedRow[`Column${newIndex + 1}`] = row[originalKey] || '';
        });
        return reorderedRow;
      });
      setJsonTableData({
        columns: updatedColumns,
        rows: updatedRows,
      });
    };

    const handleUpdateCell = (rowIndex: number, columnIndex: number, value: string) => {
      const columnKey = `Column${columnIndex + 1}`;
      const updatedRows = [...jsonTableData.rows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [columnKey]: value,
      };
      setJsonTableData({
        ...jsonTableData,
        rows: updatedRows,
      });
    };

    const handleDeleteRow = (rowIndex: number) => {
      const updatedRows = jsonTableData.rows.filter((_, i) => i !== rowIndex);
      setJsonTableData({
        ...jsonTableData,
        rows: updatedRows,
      });
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

    const handleDragStart = (detailId: number | string) => {
      setDraggedDetailId(detailId);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropDetailId: number | string) => {
      e.preventDefault();
      if (draggedDetailId === null || draggedDetailId === dropDetailId) {
        setDraggedDetailId(null);
        return;
      }

      // Sort details by sortOrder first
      const sortedDetails = [...details].sort((a, b) => a.sortOrder - b.sortOrder);
      
      // Find the dragged item and drop target indices
      const draggedIndex = sortedDetails.findIndex((d) => d.id === draggedDetailId);
      const dropIndex = sortedDetails.findIndex((d) => d.id === dropDetailId);
      
      if (draggedIndex === -1 || dropIndex === -1 || draggedIndex === dropIndex) {
        setDraggedDetailId(null);
        return;
      }
      
      // Remove dragged item from its position
      const draggedItem = sortedDetails[draggedIndex];
      const newDetails = sortedDetails.filter((_, index) => index !== draggedIndex);
      
      // Insert at new position (adjust index if dragging down)
      const finalDropIndex = dropIndex > draggedIndex ? dropIndex - 1 : dropIndex;
      newDetails.splice(finalDropIndex, 0, draggedItem);
      
      // Update sort orders sequentially starting from 1
      const reorderedDetails = newDetails.map((detail, index) => ({
        ...detail,
        sortOrder: index + 1,
      }));

      setDetails(reorderedDetails);
      setDraggedDetailId(null);
      if (onDetailsChange) {
        onDetailsChange(reorderedDetails);
      }
    };

    const handleDragEnd = () => {
      setDraggedDetailId(null);
    };

    const handleSaveAll = async () => {
      setError(null);
      if (!isAuthenticated) {
        setError('You must be logged in to save thought details.');
        throw new Error('You must be logged in to save thought details.');
      }

      setSaving(true);
      try {
        if (textType === 'Json') {
          // Handle Json type
          if (jsonTableData.columns.length === 0) {
            // No columns, delete existing details if any
            if (originalDetailIds.length > 0) {
              await Promise.all(
                originalDetailIds.map((id) => apiClient.delete(`api/thoughtdetails/${id}`))
              );
            }
            setDetails([]);
            setOriginalDetailIds([]);
            return;
          }

          // Build JSON with Column1, Column2, etc. placeholders
          const jsonRows = jsonTableData.rows.map((row) => {
            const jsonRow: Record<string, string> = {};
            jsonTableData.columns.forEach((_, index) => {
              const columnKey = `Column${index + 1}`;
              jsonRow[columnKey] = row[columnKey] || '';
            });
            return jsonRow;
          });

          const jsonString = JSON.stringify(jsonRows);

          // Delete existing details
          if (originalDetailIds.length > 0) {
            await Promise.all(
              originalDetailIds.map((id) => apiClient.delete(`api/thoughtdetails/${id}`))
            );
          }

          // Create InsertThoughtDetailDto with JsonDetails
          // Note: Property names should match C# DTO (PascalCase or camelCase depending on API config)
          const payload: any = {
            thoughtId: thoughtId,
            textType: 'Json',
            jsonDetails: {
              keys: jsonTableData.columns,
              json: jsonString,
            },
          };

          await apiClient.post('api/thoughtdetails', payload);

          // Reload details
          const response = await apiClient.get<ThoughtDetail[]>(
            `api/thoughtdetails/thought/${thoughtId}`
          );
          const sortedDetails = [...response.data].sort((a, b) => a.sortOrder - b.sortOrder);
          const headerDetail = sortedDetails.find((d) => d.sortOrder === 1);
          const jsonDetail = sortedDetails.find((d) => d.sortOrder === 2);
          
          if (headerDetail && jsonDetail) {
            setDetails([headerDetail, jsonDetail]);
            setOriginalDetailIds([headerDetail.id, jsonDetail.id]);
          }
        } else {
          // Handle PlainText type
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
            // Delete all existing details
            if (originalDetailIds.length > 0) {
              await Promise.all(
                originalDetailIds.map((id) => apiClient.delete(`api/thoughtdetails/${id}`))
              );
            }
            setDetails([]);
            setOriginalDetailIds([]);
            return;
          }

          // Check for duplicate sort orders
          const sortOrders = validDetails.map((d) => d.sortOrder);
          const duplicateSortOrders = sortOrders.filter(
            (order, index) => sortOrders.indexOf(order) !== index
          );
          
          if (duplicateSortOrders.length > 0) {
            const errorMessage = `Duplicate sort orders found. Please ensure each detail has a unique sort order. Duplicate values: ${[...new Set(duplicateSortOrders)].join(', ')}`;
            setError(errorMessage);
            throw new Error(errorMessage);
          }

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

    if (textType === 'Json') {
      return (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <IconButton
              color="primary"
              onClick={handleAddColumn}
              disabled={saving || jsonTableData.columns.length >= 12}
              title="Add Column"
            >
              <AddIcon />
              <Box component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
                Add Column
              </Box>
            </IconButton>
            <IconButton
              color="primary"
              onClick={handleAddDetail}
              disabled={saving || jsonTableData.columns.length === 0}
              title="Add Row"
            >
              <AddIcon />
              <Box component="span" sx={{ ml: 1, fontSize: '0.875rem' }}>
                Add Row
              </Box>
            </IconButton>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {jsonTableData.columns.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Box sx={{ typography: 'body1', color: 'text.secondary' }}>
                No columns yet. Click "Add Column" to add a column.
              </Box>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: '100%',
                overflowX: 'auto',
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        minWidth: 50,
                        position: 'sticky',
                        left: 0,
                        zIndex: 3,
                        backgroundColor: 'background.paper',
                      }}
                    >
                      {/* Row add button column */}
                    </TableCell>
                    {jsonTableData.columns.map((column, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          minWidth: 150,
                          backgroundColor: 'background.paper',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            value={column}
                            onChange={(e) => handleUpdateColumnName(index, e.target.value)}
                            size="small"
                            placeholder="Column name"
                            sx={{ flex: 1 }}
                            disabled={saving}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteColumn(index)}
                            disabled={saving}
                            title="Delete Column"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jsonTableData.rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={jsonTableData.columns.length + 1}
                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                      >
                        No rows yet. Click "Add Row" to add a row.
                      </TableCell>
                    </TableRow>
                  ) : (
                    jsonTableData.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell
                          sx={{
                            position: 'sticky',
                            left: 0,
                            zIndex: 2,
                            backgroundColor: 'background.paper',
                          }}
                        >
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteRow(rowIndex)}
                            disabled={saving}
                            title="Delete Row"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                        {jsonTableData.columns.map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <TextField
                              value={row[`Column${colIndex + 1}`] || ''}
                              onChange={(e) =>
                                handleUpdateCell(rowIndex, colIndex, e.target.value)
                              }
                              size="small"
                              fullWidth
                              disabled={saving}
                              placeholder="Value"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
                <Paper
                  key={detail.id}
                  sx={{
                    p: 2,
                    cursor: 'move',
                    opacity: draggedDetailId === detail.id ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}
                  draggable
                  onDragStart={() => handleDragStart(detail.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, detail.id)}
                  onDragEnd={handleDragEnd}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: detail.isExpanded ? 2 : 0,
                    }}
                  >
                    <DragIndicatorIcon
                      sx={{
                        color: 'text.secondary',
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                      }}
                    />
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
