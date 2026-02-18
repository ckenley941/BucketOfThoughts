import { Box, Typography } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';

export interface WebsiteLinksStepHandle {
  save: () => Promise<void>;
}

interface WebsiteLinksStepProps {
  thoughtId: number;
}

const WebsiteLinksStep = forwardRef<WebsiteLinksStepHandle, WebsiteLinksStepProps>(
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
          Website Links
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Website Links functionality coming soon...
        </Typography>
      </Box>
    );
  }
);

WebsiteLinksStep.displayName = 'WebsiteLinksStep';

export default WebsiteLinksStep;
