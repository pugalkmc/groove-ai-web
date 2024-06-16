import React, { useState } from 'react';
import { Container, Typography, Button, TextField, MenuItem, Box, Alert } from '@mui/material';
import axios from 'axios';

const ExpertHelp = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [helpCategory, setHelpCategory] = useState('');
  const [details, setDetails] = useState('');
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleTriggerExpert = async () => {
    try {
      const res = await axios.post('/api/trigger-expert', { helpCategory, details });
      setResponse(res.data);
      setStatus('pending');
    } catch (err) {
      setError('Failed to trigger expert.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTriggerExpert();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Talk to Expert
      </Typography>
      <Box>
        <Button variant="contained" onClick={() => setSelectedOption('trigger')} sx={{ mr: 2 }}>
          Trigger Expert
        </Button>
        <Button variant="contained" href="mailto:pugalkmc@gmail.com" sx={{ mr: 2 }}>
          Email Contact
        </Button>
        <Button variant="contained" href="https://telegram.me/pugalkmc">
          Telegram Contact
        </Button>
      </Box>
      {selectedOption === 'trigger' && (
        <Box component="form" onSubmit={handleSubmit} mt={4}>
          <TextField
            select
            label="Help Category"
            value={helpCategory}
            onChange={(e) => setHelpCategory(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="category1">Bot Feeding</MenuItem>
            <MenuItem value="category2">Accuracy Regarding</MenuItem>
            <MenuItem value="category3">Bot Controls</MenuItem>
            <MenuItem value="category4">Others</MenuItem>
          </TextField>
          <TextField
            label="Brief Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      )}
      {response && (
        <Alert severity="success" sx={{ mt: 4 }}>
          Expert triggered at {response.triggeredTime}. Status: {status}.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default ExpertHelp;
