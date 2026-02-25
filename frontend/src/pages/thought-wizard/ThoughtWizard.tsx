import {
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../../services/api';
import { refreshRecentThoughts } from '../../hooks';
import type { Thought, ThoughtBucket } from '../../types';
import ThoughtStep, { type ThoughtStepData } from './ThoughtStep';
import DetailsStep from './DetailsStep';
import WebsiteLinksStep from './WebsiteLinksStep';
import RelatedThoughtsStep from './RelatedThoughtsStep';

const steps = ['Thought', 'Details', 'Website Links', 'Related Thoughts'];

interface StepHandle {
  save?: () => Promise<void>;
}

const ThoughtWizard = () => {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStepParam = searchParams.get('step');
  const thoughtIdParam = searchParams.get('thoughtId');

  const [activeStep, setActiveStep] = useState(
    activeStepParam ? parseInt(activeStepParam, 10) : 0
  );
  const [thoughtId, setThoughtId] = useState<number | null>(
    thoughtIdParam ? parseInt(thoughtIdParam, 10) : null
  );

  // Thought step data
  const [thoughtData, setThoughtData] = useState<ThoughtStepData>({
    description: '',
    textType: 'PlainText',
    showOnDashboard: true,
    thoughtDate: '',
    selectedBucket: null,
  });

  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingThought, setLoadingThought] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { isAuthenticated } = useAuth0();
  const stepRefs = useRef<(StepHandle | null)[]>([null, null, null, null]);
  const loadedThoughtIdRef = useRef<number | null>(null);

  // Update step from URL params
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const thoughtIdParam = searchParams.get('thoughtId');
    if (stepParam) {
      setActiveStep(parseInt(stepParam, 10));
    } else {
      // Reset to step 0 if no step param
      setActiveStep(0);
    }
    if (thoughtIdParam) {
      setThoughtId(parseInt(thoughtIdParam, 10));
    } else {
      // Reset thoughtId if no thoughtId param
      setThoughtId(null);
    }
  }, [searchParams]);

  // Fetch thought buckets
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
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching thought buckets'
        );
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
          setThoughtData({
            description: '',
            textType: 'PlainText',
            showOnDashboard: true,
            thoughtDate: '',
            selectedBucket: null,
          });
          loadedThoughtIdRef.current = null;
        }
        return;
      }

      // Skip if we've already loaded this thought
      if (loadedThoughtIdRef.current === thoughtId) {
        return;
      }

      // Wait for buckets to load first
      if (loadingBuckets) {
        return;
      }

      try {
        setLoadingThought(true);
        setError(null);
        const response = await apiClient.get<Thought>(`api/thoughts/${thoughtId}`);
        const thoughtDataResponse = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (thoughtDataResponse) {
          const newThoughtData: ThoughtStepData = {
            description: thoughtDataResponse.description || '',
            textType: thoughtDataResponse.textType || 'PlainText',
            showOnDashboard: thoughtDataResponse.showOnDashboard ?? true,
            thoughtDate: thoughtDataResponse.thoughtDate
              ? new Date(thoughtDataResponse.thoughtDate).toISOString().split('T')[0]
              : '',
            selectedBucket: null,
          };

          // Set selected bucket
          if (thoughtDataResponse.bucket) {
            const bucket = thoughtBuckets.find(
              (b) => b.id === thoughtDataResponse.bucket.id
            );
            newThoughtData.selectedBucket = bucket || thoughtDataResponse.bucket;
          }

          setThoughtData(newThoughtData);
          loadedThoughtIdRef.current = thoughtId;
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while loading the thought'
        );
      } finally {
        setLoadingThought(false);
      }
    };

    loadThought();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    thoughtId,
    activeStep,
    apiClient,
    thoughtBuckets,
    loadingBuckets,
  ]);

  // Save current step before navigating
  const saveCurrentStep = async (): Promise<boolean> => {
    const currentStepRef = stepRefs.current[activeStep];
    if (currentStepRef?.save) {
      try {
        setSaving(true);
        await currentStepRef.save();
        return true;
      } catch (err) {
        // Error is already handled in the step component
        return false;
      } finally {
        setSaving(false);
      }
    }
    return true;
  };

  // Save thought data (step 0)
  const saveThought = async (): Promise<number | null> => {
    setError(null);
    if (!isAuthenticated) {
      setError('You must be logged in to save a thought.');
      return null;
    }

    if (!thoughtData.description || !thoughtData.description.trim()) {
      setError('Description is required.');
      return null;
    }

    if (!thoughtData.selectedBucket) {
      setError('Please select a thought bucket.');
      return null;
    }

    try {
      setLoading(true);
      const payload: Partial<Thought> = {
        description: thoughtData.description.trim(),
        textType: thoughtData.textType || 'PlainText',
        showOnDashboard: thoughtData.showOnDashboard,
        thoughtDate: thoughtData.thoughtDate || undefined,
        bucket: {
          id: thoughtData.selectedBucket.id,
          description: thoughtData.selectedBucket.description,
          thoughtModuleId: thoughtData.selectedBucket.thoughtModuleId,
          parentId: thoughtData.selectedBucket.parentId,
          sortOrder: thoughtData.selectedBucket.sortOrder,
          showOnDashboard: thoughtData.selectedBucket.showOnDashboard,
        },
        details: [],
        websiteLinks: [],
      };

      let response;
      let thoughtDataResponse: Thought;

      if (thoughtId && thoughtId > 0) {
        // Update existing thought
        payload.id = thoughtId;
        response = await apiClient.put<Thought>('api/thoughts', payload);
        thoughtDataResponse = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
      } else {
        // Create new thought
        response = await apiClient.post<Thought>('api/thoughts', payload);
        thoughtDataResponse = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
      }

      if (thoughtDataResponse.id > 0) {
        setThoughtId(thoughtDataResponse.id);
        refreshRecentThoughts();
        return thoughtDataResponse.id;
      }
      return null;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `An error occurred while ${
              thoughtId && thoughtId > 0 ? 'updating' : 'adding'
            } the thought`
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = async (step: number) => {
    // Save current step before navigating
    let savedThoughtId: number | null = null;

    if (activeStep === 0) {
      // Save thought data
      savedThoughtId = await saveThought();
      if (!savedThoughtId) {
        return;
      }
      // Update thoughtId state immediately
      setThoughtId(savedThoughtId);
    } else {
      // Save other steps
      const canNavigate = await saveCurrentStep();
      if (!canNavigate) {
        return;
      }
    }

    // Use the saved thoughtId or the existing one
    const currentThoughtId = savedThoughtId || thoughtId;

    // Ensure thoughtId exists for steps > 0
    if (step > 0 && !currentThoughtId) {
      setError('Please complete the Thought step first.');
      return;
    }

    setActiveStep(step);
    if (currentThoughtId) {
      setSearchParams({ step: step.toString(), thoughtId: currentThoughtId.toString() });
    } else {
      setSearchParams({ step: step.toString() });
    }
  };

  const handleThoughtDataChange = (data: Partial<ThoughtStepData>) => {
    setThoughtData((prev) => ({ ...prev, ...data }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ThoughtStep
            data={thoughtData}
            thoughtBuckets={thoughtBuckets}
            loadingBuckets={loadingBuckets}
            loadingThought={loadingThought}
            onDataChange={handleThoughtDataChange}
          />
        );
      case 1:
        return thoughtId ? (
          <DetailsStep
            ref={(ref) => {
              stepRefs.current[1] = ref;
            }}
            thoughtId={thoughtId}
            textType={thoughtData.textType}
          />
        ) : null;
      case 2:
        return thoughtId ? (
          <WebsiteLinksStep
            ref={(ref) => {
              stepRefs.current[2] = ref;
            }}
            thoughtId={thoughtId}
          />
        ) : null;
      case 3:
        return thoughtId ? (
          <RelatedThoughtsStep
            ref={(ref) => {
              stepRefs.current[3] = ref;
            }}
            thoughtId={thoughtId}
          />
        ) : null;
      default:
        return null;
    }
  };

  const handleBack = async () => {
    if (activeStep > 0) {
      await handleStepChange(activeStep - 1);
    }
  };

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      await handleStepChange(activeStep + 1);
    }
  };

  const handleSaveAndClose = async () => {
    let currentThoughtId: number | null = thoughtId;

    if (activeStep === 0) {
      // Save thought data
      const savedThoughtId = await saveThought();
      if (!savedThoughtId) {
        return; // Error already displayed
      }
      currentThoughtId = savedThoughtId;
    } else {
      // Save current step
      const saved = await saveCurrentStep();
      if (!saved) {
        return; // Error already displayed
      }
    }

    // Ensure we have a thoughtId before navigating
    if (!currentThoughtId) {
      setError('Unable to save. Please complete the Thought step first.');
      return;
    }

    refreshRecentThoughts();
    navigate(`/thought/${currentThoughtId}`);
  };

  const handleStepperClick = async (index: number) => {
    if (thoughtId && index > 0) {
      await handleStepChange(index);
    } else if (index === 0) {
      await handleStepChange(0);
    }
  };

  return (
    <Box>
      {/* Header with Save and Close button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Save and Close">
            <IconButton
              color="primary"
              onClick={handleSaveAndClose}
              disabled={saving || loading || (activeStep === 0 && (!thoughtData.description?.trim() || !thoughtData.selectedBucket))}
            >
              {saving || loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SaveIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              color="error"
              onClick={() => navigate('/thoughts')}
              disabled={saving || loading}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => handleStepperClick(index)}
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

      {/* Navigation Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        {activeStep > 0 && (
          <Tooltip title="Back">
            <IconButton color="primary" onClick={handleBack} disabled={saving || loading}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}
        {activeStep < steps.length - 1 ? (
          <Tooltip title="Next">
            <IconButton
              color="primary"
              onClick={handleNext}
              disabled={
                saving ||
                loading ||
                (activeStep === 0 &&
                  (!thoughtData.description?.trim() || !thoughtData.selectedBucket))
              }
            >
              {saving || loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <ArrowForwardIcon />
              )}
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default ThoughtWizard;
