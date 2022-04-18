import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

function DrawerItem({ label, icon, onClick }) {
  return (
    <ListItem dense>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={<Typography>{label}</Typography>} />
      </ListItemButton>
    </ListItem>
  );
}

export default DrawerItem;
