import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const Thought = () => {
  const { id } = useParams<{ id: string }>();

  // TODO: Fetch thought by id
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Thought Details
      </Typography>
      <Typography variant="body1">
        Viewing thought with ID: {id}
      </Typography>
      {/* TODO: Display thought details */}
    </Box>
  );
};

export default Thought;

