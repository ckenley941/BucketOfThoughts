import {
  Typography,
  Box,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import { refreshRecentThoughts } from '../hooks';
import type { Thought, ThoughtBucket } from '../types';
import ThoughtDetails, { type ThoughtDetailsHandle } from './ThoughtDetails';

const steps = ['Thought', 'Details', 'Website Links', 'Related Thoughts'];

const AddThought = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStepParam = searchParams.get('step');
  const thoughtIdParam = searchParams.get('thoughtId');
  
  const [activeStep, setActiveStep] = useState(activeStepParam ? parseInt(activeStepParam, 10) : 0);
  const [thoughtId, setThoughtId] = useState<number | null>(thoughtIdParam ? parseInt(thoughtIdParam, 10) : null);
  const [description, setDescription] = useState('');
  const [textType, setTextType] = useState('PlainText');
  const [showOnDashboard, setShowOnDashboard] = useState(true);
  const [thoughtDate, setThoughtDate] = useState<string>('');
  const [selectedBucket, setSelectedBucket] = useState<ThoughtBucket | null>(null);
  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);

  const { isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [loadingThought, setLoadingThought] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const thoughtDetailsRef = useRef<ThoughtDetailsHandle>(null);
  const loadedThoughtIdRef = useRef<number | null>(null);

  // Update step from URL params
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const thoughtIdParam = searchParams.get('thoughtId');
    if (stepParam) {
      setActiveStep(parseInt(stepParam, 10));
    }
    if (thoughtIdParam) {
      setThoughtId(parseInt(thoughtIdParam, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchThoughtBuckets = async () => {
      if (!isAuthenticated) {
        setLoadingBuckets(false);
        return;
      }

      try {
        setLoadingBuckets(true);
        const response = await apiClient.get<ThoughtBucket[]>('api/thoughtbuckets');
        setThoughtBuckets(response.data);
        if (response.data.length > 0 && !selectedBucket) {
          setSelectedBucket(response.data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching thought buckets');
      } finally {
        setLoadingBuckets(false);
      }
    };

    fetchThoughtBuckets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Load thought data when thoughtId > 0 and on step 0
  useEffect(() => {
    const loadThought = async () => {
      if (!isAuthenticated || !thoughtId || thoughtId <= 0 || activeStep !== 0) {
        // Reset form if no thoughtId or not on step 0
        if (!thoughtId || thoughtId <= 0) {
          setDescription('');
          setTextType('PlainText');
          setShowOnDashboard(true);
          setThoughtDate('');
          setSelectedBucket(null);
          loadedThoughtIdRef.current = null;
        }
        return;
      }

      // Skip if we've already loaded this thought
      if (loadedThoughtIdRef.current === thoughtId) {
        return;
      }

      // Wait for buckets to load first (but don't block if buckets are already loaded)
      if (loadingBuckets) {
        return;
      }

      try {
        setLoadingThought(true);
        setError(null);
        const response = await apiClient.get<Thought>(`api/thoughts/${thoughtId}`);
        const thoughtData = Array.isArray(response.data) ? response.data[0] : response.data;
        
        if (thoughtData) {
          setDescription(thoughtData.description || '');
          setTextType(thoughtData.textType || 'PlainText');
          setShowOnDashboard(thoughtData.showOnDashboard ?? true);
          
          // Set thought date - format for date input (YYYY-MM-DD)
          if (thoughtData.thoughtDate) {
            const date = new Date(thoughtData.thoughtDate);
            const formattedDate = date.toISOString().split('T')[0];
            setThoughtDate(formattedDate);
          } else {
            setThoughtDate('');
          }

          // Set selected bucket
          if (thoughtData.bucket) {
            // Find the bucket in the list or set it directly
            const bucket = thoughtBuckets.find(b => b.id === thoughtData.bucket.id);
            if (bucket) {
              setSelectedBucket(bucket);
            } else {
              // If bucket not found in list, use the one from the thought
              setSelectedBucket(thoughtData.bucket);
            }
          }
          
          // Mark this thought as loaded
          loadedThoughtIdRef.current = thoughtId;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading the thought');
      } finally {
        setLoadingThought(false);
      }
    };

    loadThought();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, thoughtId, activeStep, apiClient, thoughtBuckets, loadingBuckets]);

  const handleSubmit = async () => {
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to save a thought.');
      return;
    }

    if (!description || !description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!selectedBucket) {
      setError('Please select a thought bucket.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Thought> = {
        description: description.trim(),
        textType: textType || 'PlainText',
        showOnDashboard: showOnDashboard,
        thoughtDate: thoughtDate || undefined,
        bucket: {
          id: selectedBucket.id,
          description: selectedBucket.description,
          thoughtModuleId: selectedBucket.thoughtModuleId,
          parentId: selectedBucket.parentId,
          sortOrder: selectedBucket.sortOrder,
          showOnDashboard: selectedBucket.showOnDashboard,
        },
        details: [],
        websiteLinks: [],
      };

      let response;
      let thoughtData: Thought;

      if (thoughtId && thoughtId > 0) {
        // Update existing thought
        payload.id = thoughtId;
        response = await apiClient.put<Thought>('api/thoughts', payload);
        thoughtData = Array.isArray(response.data) ? response.data[0] : response.data;
      } else {
        // Create new thought
        response = await apiClient.post<Thought>('api/thoughts', payload);
        thoughtData = Array.isArray(response.data) ? response.data[0] : response.data;
      }
      
      if (thoughtData.id > 0) {
        setThoughtId(thoughtData.id);
        refreshRecentThoughts();
        // Move to next step
        const nextStep = 1;
        setActiveStep(nextStep);
        setSearchParams({ step: nextStep.toString(), thoughtId: thoughtData.id.toString() });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `An error occurred while ${thoughtId && thoughtId > 0 ? 'updating' : 'adding'} the thought`);
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = async (step: number) => {
    // If navigating away from Details step (step 1), save first
    if (activeStep === 1 && step !== 1 && thoughtDetailsRef.current) {
      try {
        await thoughtDetailsRef.current.save();
      } catch (err) {
        // Error is already handled in ThoughtDetails component
        // Don't navigate if save fails
        return;
      }
    }

    if (step === 0 || (thoughtId && step > 0)) {
      setActiveStep(step);
      if (thoughtId) {
        setSearchParams({ step: step.toString(), thoughtId: thoughtId.toString() });
      } else {
        setSearchParams({ step: step.toString() });
      }
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderThoughtStep();
      case 1:
        return thoughtId ? <ThoughtDetailsWizard thoughtId={thoughtId} onComplete={() => handleStepChange(2)} ref={thoughtDetailsRef} /> : null;
      case 2:
        return renderWebsiteLinksStep();
      case 3:
        return renderRelatedThoughtsStep();
      default:
        return null;
    }
  };

  const renderThoughtStep = () => (
    <Box component="form" sx={{ mt: 3, maxWidth: 600 }}>
      {loadingThought && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        required
        multiline
        rows={4}
        disabled={loadingThought}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Thought Bucket</InputLabel>
        <Select
          value={selectedBucket?.id || ''}
          label="Thought Bucket"
          onChange={(e) => {
            const bucketId = e.target.value as number;
            const bucket = thoughtBuckets.find(b => b.id === bucketId);
            setSelectedBucket(bucket || null);
          }}
          disabled={loadingBuckets || loadingThought}
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
        value={textType}
        onChange={(e) => setTextType(e.target.value)}
        margin="normal"
        helperText="Default: PlainText"
        disabled={loadingThought}
      />
      <TextField
        fullWidth
        label="Thought Date"
        type="date"
        value={thoughtDate}
        onChange={(e) => setThoughtDate(e.target.value)}
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
            checked={showOnDashboard}
            onChange={(e) => setShowOnDashboard(e.target.checked)}
            disabled={loadingThought}
          />
        }
        label="Show on Dashboard"
        sx={{ mt: 2 }}
      />
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Tooltip title="Next">
          <IconButton
            color="primary"
            onClick={handleSubmit}
            disabled={loading || loadingBuckets || loadingThought}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <ArrowForwardIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            color="error"
            onClick={() => navigate('/thoughts')}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderWebsiteLinksStep = () => (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Website Links
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Website Links functionality coming soon...
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Tooltip title="Back">
          <IconButton
            color="primary"
            onClick={() => handleStepChange(1)}
            disabled={!thoughtId}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next">
          <IconButton
            color="primary"
            onClick={() => handleStepChange(3)}
            disabled={!thoughtId}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            color="error"
            onClick={() => navigate('/thoughts')}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderRelatedThoughtsStep = () => (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Related Thoughts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Related Thoughts functionality coming soon...
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Tooltip title="Back">
          <IconButton
            color="primary"
            onClick={() => handleStepChange(2)}
            disabled={!thoughtId}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Finish">
          <IconButton
            color="primary"
            onClick={() => {
              refreshRecentThoughts();
              navigate('/thoughts');
            }}
            disabled={!thoughtId}
          >
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            color="error"
            onClick={() => navigate('/thoughts')}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {thoughtId && thoughtId > 0 ? 'Edit Thought' : 'Add a New Thought'}
      </Typography>
      
      {/* Stepper */}
      <Box sx={{ mb: 4, mt: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={async () => {
                  if (thoughtId && index > 0) {
                    await handleStepChange(index);
                  } else if (index === 0) {
                    await handleStepChange(0);
                  }
                }}
                sx={{
                  cursor: thoughtId || index === 0 ? 'pointer' : 'default',
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      {renderStepContent()}
    </Box>
  );
};

// Wrapper component for ThoughtDetails in wizard mode
interface ThoughtDetailsWizardProps {
  thoughtId: number;
  onComplete: () => void;
}

const ThoughtDetailsWizard = React.forwardRef<ThoughtDetailsHandle, ThoughtDetailsWizardProps>(
  ({ thoughtId, onComplete }, ref) => {
    const navigate = useNavigate();
    const [, setSearchParams] = useSearchParams();
    
    const handleSaveComplete = () => {
      // After saving, move to next step
      onComplete();
    };

    const handleBack = async () => {
      // Save before going back
      if (ref && typeof ref !== 'function' && ref.current) {
        try {
          await ref.current.save();
        } catch (err) {
          // Error is already handled in ThoughtDetails component
          // Don't navigate if save fails
          return;
        }
      }
      setSearchParams({ step: '0', thoughtId: thoughtId.toString() });
    };

    const handleNext = async () => {
      // Save before going to next step
      if (ref && typeof ref !== 'function' && ref.current) {
        try {
          await ref.current.save();
        } catch (err) {
          // Error is already handled in ThoughtDetails component
          // Don't navigate if save fails
          return;
        }
      }
      onComplete();
    };

    return (
      <Box>
        <ThoughtDetails 
          thoughtId={thoughtId} 
          onSaveComplete={handleSaveComplete}
          hideNavigation={true}
          skipSaveComplete={true}
          ref={ref}
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Tooltip title="Back">
            <IconButton
              color="primary"
              onClick={handleBack}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Next">
            <IconButton
              color="primary"
              onClick={handleNext}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              color="error"
              onClick={() => navigate('/thoughts')}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }
);

ThoughtDetailsWizard.displayName = 'ThoughtDetailsWizard';

export default AddThought;





