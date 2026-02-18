import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { useEffect } from 'react';
import type { ThoughtBucket } from '../../types';

export interface ThoughtStepData {
  description: string;
  textType: string;
  showOnDashboard: boolean;
  thoughtDate: string;
  selectedBucket: ThoughtBucket | null;
}

interface ThoughtStepProps {
  data: ThoughtStepData;
  thoughtBuckets: ThoughtBucket[];
  loadingBuckets: boolean;
  loadingThought: boolean;
  onDataChange: (data: Partial<ThoughtStepData>) => void;
}

const ThoughtStep = ({
  data,
  thoughtBuckets,
  loadingBuckets,
  loadingThought,
  onDataChange,
}: ThoughtStepProps) => {
  // Auto-select first bucket when buckets finish loading and none is selected
  useEffect(() => {
    if (
      !loadingBuckets &&
      thoughtBuckets.length > 0 &&
      !data.selectedBucket
    ) {
      // Ensure we have a valid bucket before selecting
      const firstBucket = thoughtBuckets[0];
      if (firstBucket && firstBucket.id) {
        onDataChange({ selectedBucket: firstBucket });
      }
    }
  }, [loadingBuckets, thoughtBuckets.length, data.selectedBucket, onDataChange]);

  return (
    <Box component="form" sx={{ mt: 3, maxWidth: 600 }}>
      {loadingThought && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <TextField
        fullWidth
        label="Description"
        value={data.description}
        onChange={(e) => onDataChange({ description: e.target.value })}
        margin="normal"
        required
        multiline
        rows={4}
        disabled={loadingThought}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Thought Bucket</InputLabel>
        <Select
          value={data.selectedBucket?.id || ''}
          label="Thought Bucket"
          onChange={(e) => {
            const bucketId = e.target.value as number;
            const bucket = thoughtBuckets.find((b) => b.id === bucketId);
            onDataChange({ selectedBucket: bucket || null });
          }}
          disabled={loadingBuckets || loadingThought}
          displayEmpty
        >
          {loadingBuckets ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : thoughtBuckets.length === 0 ? (
            <MenuItem disabled>No thought buckets available</MenuItem>
          ) : (
            thoughtBuckets.map((bucket) => (
              <MenuItem key={bucket.id} value={bucket.id}>
                {bucket.description || `Bucket #${bucket.id}`}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Text Type"
        value={data.textType}
        onChange={(e) => onDataChange({ textType: e.target.value })}
        margin="normal"
        helperText="Default: PlainText"
        disabled={loadingThought}
      />
      <TextField
        fullWidth
        label="Thought Date"
        type="date"
        value={data.thoughtDate}
        onChange={(e) => onDataChange({ thoughtDate: e.target.value })}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Leave empty to use current date"
        disabled={loadingThought}
      />
      <FormControlLabel
        control={
          <Switch
            checked={data.showOnDashboard}
            onChange={(e) => onDataChange({ showOnDashboard: e.target.checked })}
            disabled={loadingThought}
          />
        }
        label="Show on Dashboard"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default ThoughtStep;
