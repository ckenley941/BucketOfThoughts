import { Typography, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';

const AddThought = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // TODO: Implement add thought functionality
    console.log('Adding thought:', { title, content });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add a New Thought
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          multiline
          rows={10}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Add Thought
        </Button>
      </Box>
    </Box>
  );
};

export default AddThought;

