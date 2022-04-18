import React from 'react';
import { List, Divider, Typography, ListItem } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';

import DrawerItem from './DrawerItem';

function Drawer({ user }) {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['token']);

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    navigate('/login');
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 250,
        bgcolor: 'background.main',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DrawerItem label="Search" icon={<SearchIcon />} />
      <Divider />
      <ListItem>
        <Typography variant="h6">Tasks</Typography>
      </ListItem>
      {/* Todo: map tasks & todos */}
      <div style={{ flex: 1 }}></div>
      <Divider />
      <DrawerItem label="Setting" icon={<SettingsIcon />} />
      <DrawerItem label="Logout" icon={<LogoutIcon />} onClick={handleLogout} />
    </List>
  );
}

export default Drawer;
