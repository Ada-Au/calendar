import React, { useState } from 'react';
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function PasswordField({ onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <OutlinedInput
      size="small"
      type={showPassword ? 'text' : 'password'}
      onChange={onChange}
      error={error}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClick}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

export default PasswordField;
