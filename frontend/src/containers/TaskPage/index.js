import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { styled, Box, Typography } from '@mui/material';
import 'react-calendar/dist/Calendar.css';

import LoadingSpinner from '../../components/LoadingSpinner';
import Calendar from '../../components/Calendar';
import Drawer from '../../components/Drawer';

function TaskPage({ params }) {
  const taskId = decode64(params.taskId);

  const handleToggle = () => {
    setShowDrawer((prev) => !prev);
  };
  if (loading) return <LoadingSpinner />;
  if (error) {
    console.log('error', error);
    return;
  }
  const { name, email } = data.me;
  return <Box>{taskId}</Box>;
}

export default TaskPage;
