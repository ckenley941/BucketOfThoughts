import {
  Card,
  CardContent,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Thought } from '../types';

interface ThoughtCardProps {
  thought: Thought;
  onClick?: () => void;
  allowDelete?: boolean;
  handleDelete?: () => void;
}

const ThoughtCard = ({ thought, onClick, allowDelete = false, handleDelete }: ThoughtCardProps) => {
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

  const truncateDescription = (description: string | undefined, maxLength: number = 100): string => {
    if (!description) return '(No description)';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 4 } : {},
        position: 'relative',
      }}
      onClick={onClick}
    >
      {allowDelete && handleDelete && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Tooltip title="Remove related thought">
            <IconButton
              size="small"
              color="error"
              sx={{
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
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
          <Accordion
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when accordion is clicked
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" color="text.secondary">
                View Details ({thought.details.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {thought.details.map((detail) => {
                  const fullDescription = detail.description || '(No description)';
                  const truncatedDescription = truncateDescription(detail.description);
                  const isTruncated = fullDescription.length > 100;

                  return (
                    <Box key={detail.id} sx={{ pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5, fontWeight: 'medium' }}
                      >
                        #{detail.sortOrder}
                      </Typography>
                      {isTruncated ? (
                        <Tooltip title={fullDescription} arrow>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', cursor: 'help' }}>
                            {truncatedDescription}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {fullDescription}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
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
