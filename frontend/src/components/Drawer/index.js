import React from 'react';
import {
  styled,
  List,
  Divider,
  Typography,
  ListItem,
  IconButton,
  Box,
} from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import DrawerItem from './DrawerItem';

const UserEmail = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.darkGrey,
}));

const ListWrapper = styled(List, {
  shouldForwardProp: (prop) => prop !== 'show',
})(({ theme, show }) => ({
  position: 'absolute',
  left: show ? 0 : -200,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'left 1s',
  width: 200,
  backgroundColor: theme.palette.primary.main,
}));

const Wrapper = styled(Box, { shouldForwardProp: (prop) => prop !== 'show' })(
  ({ show }) => ({
    width: show ? 200 : 0,
    transition: 'width 1s',
  })
);

function Drawer({ user, show, onToggle }) {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(['token']);

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    navigate('/');
  };

  return (
    <Wrapper show={show}>
      <ListWrapper show={show}>
        <Box
          sx={{
            position: 'absolute',
            left: 192,
            bgcolor: 'primary.main',
            borderRadius: '0px 8px 8px 0px',
          }}
        >
          <IconButton onClick={() => onToggle()}>
            {show ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </IconButton>
        </Box>
        <ListItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography>{user.name}, Welcome back!</Typography>
          <UserEmail variant="caption">{user.email}</UserEmail>
        </ListItem>
        <Divider />
        <DrawerItem label="Search" icon={<SearchIcon />} />
        <Divider />
        <ListItem>
          <Typography variant="h6">Tasks</Typography>
        </ListItem>
        {/* Todo: map tasks & todos */}
        <div style={{ flex: 1 }}></div>
        <Divider />
        <DrawerItem label="Setting" icon={<SettingsIcon />} />
        <DrawerItem
          label="Logout"
          icon={<LogoutIcon />}
          onClick={handleLogout}
        />
      </ListWrapper>
    </Wrapper>
  );
}

export default Drawer;
