import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Box } from '@mui/material';
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

function HomePage() {
  const { data, loading, error } = useQuery(ME);

  const onChange = (e) => {
    console.log('onChange', e);
  };
  if (loading) return <LoadingSpinner />;
  if (error) console.log('error', error);
  console.log(data);
  const { name, email } = data.me;
  return (
    <Box>
      <Box height="100vh" display="flex" flexDirection="row">
        <Drawer />
        <Box flex="1" sx={{ px: 8, display: 'flex', flexDirection: 'column' }}>
          {/* <CustomCalendar /> */}
          <Calendar />
          <header className="App-header">
            <p>
              Edit <code>src/App.js</code> and save to reload.
              {name}
              {email}
            </p>
          </header>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
