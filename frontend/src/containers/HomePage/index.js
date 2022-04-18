import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { styled, Box, Typography } from '@mui/material';
import 'react-calendar/dist/Calendar.css';

import LoadingSpinner from '../../components/LoadingSpinner';
import Calendar from '../../components/Calendar';
import Drawer from '../../components/Drawer';
import CustomCalendar from '../../components/CustomCalendar';

const ME = gql`
  query Me {
    me {
      name
      email
    }
  }
`;

const Wrapper = styled(Box)(() => ({
  padding: '0px 32px',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
}));

function HomePage() {
  const { data, loading, error } = useQuery(ME);
  const [showDrawer, setShowDrawer] = useState(true);

  const handleToggle = () => {
    setShowDrawer((prev) => !prev);
  };
  if (loading) return <LoadingSpinner />;
  if (error) {
    console.log('error', error);
    return <LoadingSpinner />;
  }
  const { name, email } = data.me;
  return (
    <Box>
      <Box height="100vh" display="flex" flexDirection="row">
        <Drawer user={data.me} show={showDrawer} onToggle={handleToggle} />
        <Wrapper>
          {/* <CustomCalendar /> */}
          <Typography>Welcome back {name}!</Typography>
          <Calendar />
        </Wrapper>
      </Box>
    </Box>
  );
}

export default HomePage;
