import React from 'react';
import { styled } from '@mui/material/styles';

const SpinnerContainer = styled('div')(() => ({
  display: 'grid',
  justifyContent: 'center',
  alignItems: 'center',
  height: '350px',
  width: '100%',
}));

const Spinner = styled('span')(({ theme }) => ({
  width: '50px',
  height: '50px',
  border: `10px solid ${theme.palette.secondary.main}`,
  borderTop: `10px solid ${theme.palette.tertiary.main}`,
  borderRadius: '50%',
  animation: 'spinner 1.5s linear infinite',
  '@keyframes spinner': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
}

export default LoadingSpinner;
