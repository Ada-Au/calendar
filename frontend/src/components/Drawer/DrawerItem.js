import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

function DrawerItem({ label, icon, onClick }) {
  return (
    <ListItem>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

export default DrawerItem;
