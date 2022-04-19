import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton({ sx }) {
  const navigate = useNavigate();
  return (
    <Box sx={sx}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Back
      </Button>
    </Box>
  );
}

export default BackButton;
