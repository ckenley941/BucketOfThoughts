import { Box, Typography } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';

export interface RelatedThoughtsStepHandle {
  save: () => Promise<void>;
}

interface RelatedThoughtsStepProps {
  thoughtId: number;
}

const RelatedThoughtsStep = forwardRef<RelatedThoughtsStepHandle, RelatedThoughtsStepProps>(
  ({ thoughtId }, ref) => {
    useImperativeHandle(ref, () => ({
      save: async () => {
        // Placeholder - no save needed yet
        return Promise.resolve();
      },
    }));

    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Related Thoughts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Related Thoughts functionality coming soon...
        </Typography>
      </Box>
    );
  }
);

RelatedThoughtsStep.displayName = 'RelatedThoughtsStep';

export default RelatedThoughtsStep;
