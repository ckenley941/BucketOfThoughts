import {
  Card,
  CardContent,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Thought } from '../types';

interface ThoughtCardProps {
  thought: Thought;
  onClick?: () => void;
}

const ThoughtCard = ({ thought, onClick }: ThoughtCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        {/* Bucket */}
        {thought.bucket && (
          <Box sx={{ mb: 1 }}>
            <Chip
              label={thought.bucket.description}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        )}

        {/* Description */}
        <Typography variant="h6" component="h3" gutterBottom>
          {thought.description || `Thought #${thought.id}`}
        </Typography>

        {/* Thought Date */}
        {thought.thoughtDate && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {formatDate(thought.thoughtDate)}
          </Typography>
        )}

        {/* Accordion for Details */}
        {(thought.details && thought.details.length > 0) && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" color="text.secondary">
                View Details ({thought.details.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {thought.details.map((detail) => (
                  <Box key={detail.id} sx={{ pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontWeight: 'medium' }}
                    >
                      #{detail.sortOrder}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {detail.description || '(No description)'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Show message if no details */}
        {(!thought.details || thought.details.length === 0) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No details available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ThoughtCard;
