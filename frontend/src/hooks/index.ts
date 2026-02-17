// Add your custom hooks here
export { useThoughtBuckets, refreshThoughtBuckets } from './useThoughtBuckets';

/**
 * Trigger a refresh of recent thoughts in the sidebar
 */
export const refreshRecentThoughts = () => {
  window.dispatchEvent(new CustomEvent('recentThoughts:refresh'));
};





