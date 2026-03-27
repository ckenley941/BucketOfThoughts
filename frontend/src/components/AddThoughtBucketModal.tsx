import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshThoughtBuckets } from '../hooks';
import type { ThoughtBucket, ThoughtModule } from '../types';

export interface AddThoughtBucketModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after the bucket is created successfully (API response body). */
  onSuccess: (bucket: ThoughtBucket) => void;
}

const defaultForm = (): Partial<ThoughtBucket> => ({
  description: '',
  thoughtModuleId: 0,
  parentId: undefined,
  sortOrder: 0,
  showOnDashboard: true,
});

const AddThoughtBucketModal = ({ open, onClose, onSuccess }: AddThoughtBucketModalProps) => {
  const apiClient = useApiClient();
  const { isAuthenticated } = useAuth0();
  const [formData, setFormData] = useState<Partial<ThoughtBucket>>(defaultForm);
  const [thoughtModules, setThoughtModules] = useState<ThoughtModule[]>([]);
  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !isAuthenticated) {
      return;
    }

    let cancelled = false;
    setFormData(defaultForm());
    setError(null);

    const load = async () => {
      setOptionsLoading(true);
      try {
        const [modulesRes, bucketsRes] = await Promise.all([
          apiClient.get<ThoughtModule[]>('api/thoughtmodules'),
          apiClient.get<ThoughtBucket[]>('api/thoughtbuckets'),
        ]);
        if (!cancelled) {
          setThoughtModules(modulesRes.data);
          setThoughtBuckets(bucketsRes.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load options');
        }
      } finally {
        if (!cancelled) {
          setOptionsLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open, isAuthenticated, apiClient]);

  const parentBucketOptions = thoughtBuckets
    .slice()
    .sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }));

  const handleSubmit = async () => {
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to save.');
      return;
    }
    if (!formData.description?.trim()) {
      setError('Description is required.');
      return;
    }
    if (!formData.thoughtModuleId || formData.thoughtModuleId <= 0) {
      setError('Please select a thought module.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<ThoughtBucket> = {
        description: formData.description.trim(),
        thoughtModuleId: formData.thoughtModuleId,
        parentId: formData.parentId,
        sortOrder: formData.sortOrder ?? 0,
        showOnDashboard: formData.showOnDashboard ?? true,
      };
      const response = await apiClient.post<ThoughtBucket>('api/thoughtbuckets', payload);
      refreshThoughtBuckets();
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thought bucket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving) onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add thought bucket</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {optionsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="div" sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              required
              inputProps={{ maxLength: 256 }}
              disabled={saving}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="add-tb-module-label" shrink>
                Thought module
              </InputLabel>
              <Select
                labelId="add-tb-module-label"
                label="Thought module"
                value={formData.thoughtModuleId && formData.thoughtModuleId > 0 ? formData.thoughtModuleId : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thoughtModuleId: Number(e.target.value),
                  })
                }
                disabled={saving}
              >
                <MenuItem value="">
                  <em>Select a module</em>
                </MenuItem>
                {thoughtModules.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="add-tb-parent-label" shrink>
                Parent bucket
              </InputLabel>
              <Select
                labelId="add-tb-parent-label"
                label="Parent bucket"
                displayEmpty
                value={formData.parentId ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData({
                    ...formData,
                    parentId: v === '' ? undefined : Number(v),
                  });
                }}
                disabled={saving}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {parentBucketOptions.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Sort Order"
              type="number"
              value={formData.sortOrder ?? 0}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
              margin="normal"
              inputProps={{ min: 0 }}
              disabled={saving}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.showOnDashboard ?? true}
                  onChange={(e) => setFormData({ ...formData, showOnDashboard: e.target.checked })}
                  disabled={saving}
                />
              }
              label="Show on Dashboard"
              sx={{ mt: 1 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving || optionsLoading}>
          {saving ? <CircularProgress size={22} color="inherit" /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddThoughtBucketModal;
