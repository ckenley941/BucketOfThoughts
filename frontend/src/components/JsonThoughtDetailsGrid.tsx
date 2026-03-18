import { Box, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { ThoughtDetail } from '../types';

interface JsonThoughtDetailsGridProps {
  details: ThoughtDetail[];
}

const JsonThoughtDetailsGrid = ({ details }: JsonThoughtDetailsGridProps) => {
  // Find header detail (SortOrder = 1) and data detail (SortOrder = 2)
  const headerDetail = details.find((d) => d.sortOrder === 1);
  const dataDetail = details.find((d) => d.sortOrder === 2);

  if (!headerDetail || !dataDetail) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="error">
          Invalid JSON detail structure. Expected exactly 2 details with SortOrder 1 and 2.
        </Typography>
      </Box>
    );
  }

  // Extract column names from header detail (pipe-delimited)
  const columnNames = headerDetail.description
    .split('|')
    .map((col) => col.trim())
    .filter((col) => col.length > 0);

  if (columnNames.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="error">
          No column names found in header detail.
        </Typography>
      </Box>
    );
  }

  // Parse JSON string from data detail
  let rows: Record<string, unknown>[] = [];
  try {
    const jsonData = JSON.parse(dataDetail.description);
    if (Array.isArray(jsonData)) {
      rows = jsonData;
    } else {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="error">
            Invalid JSON format. Expected an array of objects.
          </Typography>
        </Box>
      );
    }
  } catch (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="error">
          Error parsing JSON data: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  // Create DataGrid columns from column names
  const columns: GridColDef[] = columnNames.map((columnName) => ({
    field: columnName,
    headerName: columnName,
    flex: 1,
    minWidth: 150,
  }));

  // Transform rows to ensure they have the correct structure
  // The JSON should have actual column names as keys (after backend processing)
  // But we also handle Column1, Column2 format for backwards compatibility
  const transformedRows = rows.map((row, rowIndex) => {
    const transformedRow: Record<string, unknown> = { id: rowIndex };
    columnNames.forEach((colName, index) => {
      // Try the actual column name first, then fall back to Column{i+1} format
      const columnKey = `Column${index + 1}`;
      const value = row[colName] ?? row[columnKey] ?? '';
      transformedRow[colName] = value;
    });
    return transformedRow;
  });

  if (transformedRows.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No data rows available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, width: '100%', mt: 2 }}>
      <DataGrid
        rows={transformedRows}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
        }}
      />
    </Box>
  );
};

export default JsonThoughtDetailsGrid;
