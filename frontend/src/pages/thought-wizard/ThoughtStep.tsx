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
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import type { ThoughtBucket } from '../../types';
import AddThoughtBucketModal from '../../components/AddThoughtBucketModal';

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
  /** After a new bucket is created from the modal, parent refetches and can update selection. */
  onThoughtBucketCreated?: (bucket: ThoughtBucket) => void;
}

const ThoughtStep = ({
  data,
  thoughtBuckets,
  loadingBuckets,
  loadingThought,
  onDataChange,
  onThoughtBucketCreated,
}: ThoughtStepProps) => {
  const [addBucketOpen, setAddBucketOpen] = useState(false);

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
        onDataChange({
          selectedBucket: firstBucket,
          showOnDashboard: firstBucket.showOnDashboard ?? true,
        });
      }
    }
  }, [loadingBuckets, thoughtBuckets.length, data.selectedBucket, onDataChange]);

  // Set default textType to 'PlainText' if empty
  useEffect(() => {
    if (!data.textType) {
      onDataChange({ textType: 'PlainText' });
    }
  }, [data.textType, onDataChange]);

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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
        <FormControl fullWidth margin="normal" required sx={{ flex: 1, mt: 2 }}>
          <InputLabel>Thought Bucket</InputLabel>
          <Select
            value={data.selectedBucket?.id || ''}
            label="Thought Bucket"
            onChange={(e) => {
              const bucketId = e.target.value as number;
              const bucket = thoughtBuckets.find((b) => b.id === bucketId);
              onDataChange({
                selectedBucket: bucket || null,
                showOnDashboard: bucket?.showOnDashboard ?? true,
              });
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
        <Tooltip title="Add thought bucket">
          <span>
            <IconButton
              color="primary"
              aria-label="Add thought bucket"
              onClick={() => setAddBucketOpen(true)}
              disabled={loadingThought}
              sx={{ mt: 2 }}
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <AddThoughtBucketModal
        open={addBucketOpen}
        onClose={() => setAddBucketOpen(false)}
        onSuccess={(bucket) => {
          onThoughtBucketCreated?.(bucket);
        }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Details Type</InputLabel>
        <Select
          value={data.textType || 'PlainText'}
          label="Details Type"
          onChange={(e) => onDataChange({ textType: e.target.value })}
          disabled={loadingThought}
        >
          <MenuItem value="PlainText">Text</MenuItem>
          <MenuItem value="Json">Table</MenuItem>
        </Select>
      </FormControl>
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
