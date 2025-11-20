import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Thoughts = () => {
  const navigate = useNavigate();

  // TODO: Fetch thoughts from API
  const thoughts: Array<{ id: string; title: string }> = [];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        All Thoughts
      </Typography>
      {thoughts.length === 0 ? (
        <Typography variant="body1">No thoughts yet. Add your first thought!</Typography>
      ) : (
        <List>
          {thoughts.map((thought) => (
            <ListItem
              key={thought.id}
              button
              onClick={() => navigate(`/thought/${thought.id}`)}
            >
              <ListItemText primary={thought.title} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Thoughts;

