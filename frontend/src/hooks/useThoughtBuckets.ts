import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApiClient } from '../services/api';
import type { ThoughtBucket } from '../types';

const BUCKETS_REFRESH_EVENT = 'thoughtBuckets:refresh';

/**
 * Custom hook for managing thought buckets with shared state
 * Components using this hook will automatically stay in sync
 */
export const useThoughtBuckets = () => {
  const apiClient = useApiClient();
  const { isAuthenticated } = useAuth0();
  const [thoughtBuckets, setThoughtBuckets] = useState<ThoughtBucket[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThoughtBuckets = useCallback(async () => {
    if (!isAuthenticated) {
      setThoughtBuckets([]);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get<ThoughtBucket[]>('api/thoughtbuckets');
      setThoughtBuckets(response.data);
    } catch (err) {
      console.error('Error fetching thought buckets:', err);
      // Don't throw - just log the error
    } finally {
      setLoading(false);
    }
  }, [apiClient, isAuthenticated]);

  useEffect(() => {
    fetchThoughtBuckets();

    // Listen for refresh events
    const handleRefresh = () => {
      fetchThoughtBuckets();
    };

    window.addEventListener(BUCKETS_REFRESH_EVENT, handleRefresh);

    return () => {
      window.removeEventListener(BUCKETS_REFRESH_EVENT, handleRefresh);
    };
  }, [fetchThoughtBuckets]);

  return {
    thoughtBuckets,
    loading,
    refresh: fetchThoughtBuckets,
  };
};

/**
 * Trigger a refresh of thought buckets across all components using the hook
 */
export const refreshThoughtBuckets = () => {
  window.dispatchEvent(new CustomEvent(BUCKETS_REFRESH_EVENT));
};

