import React, { useState } from 'react';
import { styled, Box } from '@mui/material';

import Calendar from '../../components/Calendar';
import Drawer from '../../components/Drawer';

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: '0px 32px',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.common.white,
}));

const Wrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: theme.palette.common.white,
}));

function HomePage() {
  const [showDrawer, setShowDrawer] = useState(true);

  const handleToggle = () => {
    setShowDrawer((prev) => !prev);
  };

  return (
    <Box>
      {/* todo: add nav map */}
      <Wrapper height="100vh" display="flex" flexDirection="row">
        <Drawer onToggle={handleToggle} />
        <ContentWrapper>
          <Calendar showDrawer={!showDrawer} />
        </ContentWrapper>
      </Wrapper>
    </Box>
  );
}

export default HomePage;
