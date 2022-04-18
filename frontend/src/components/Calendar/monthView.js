import React from 'react';
import { styled, Grid, Paper, Box } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flex: 1,
}));

const ItemWrapper = styled(Grid)(({ theme }) => ({
  display: 'flex',
}));

function MonthView() {
  const DAY_IN_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const date = new Date();
  const viewMonthDiff = 1;

  const firstDay = new Date(
    date.getFullYear(),
    date.getMonth() + viewMonthDiff,
    1
  );

  const lastMonthDayNum = new Date(
    date.getFullYear(),
    date.getMonth() + viewMonthDiff,
    0
  ).getDate();
  const currentMonthDayNum = new Date(
    date.getFullYear(),
    date.getMonth() + 1 + viewMonthDiff,
    0
  ).getDate();

  // Monday = 1, -1 to start from Sunday
  let dayBeforeMonth = firstDay.getDay() - 1;
  if (dayBeforeMonth < 0) dayBeforeMonth += 7;

  let dayAfterMonth = 35 - dayBeforeMonth - currentMonthDayNum;
  if (dayAfterMonth < 0) dayAfterMonth += 7;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, flex: 1 }}>
      <Grid container spacing={{ xs: 1 }} columns={{ xs: 7 }} sx={{ pb: 2 }}>
        {DAY_IN_WEEK.map((day, index) => (
          <Grid item xs={1} key={index}>
            <Item sx={{ bgcolor: '#ff0' }}>{day}</Item>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        spacing={{ xs: 1 }}
        columns={{ xs: 7 }}
        sx={{ height: '100%', gridAutoFlow: 'column' }}
      >
        {Array.from(Array(dayBeforeMonth)).map((_, index) => (
          <ItemWrapper item xs={1} key={index}>
            <Item sx={{ bgcolor: '#0ff' }}>
              {lastMonthDayNum - dayBeforeMonth + index + 1}
            </Item>
          </ItemWrapper>
        ))}
        {Array.from(Array(currentMonthDayNum)).map((_, index) => (
          <ItemWrapper item xs={1} key={index}>
            <Item>{index + 1}</Item>
          </ItemWrapper>
        ))}
        {Array.from(Array(dayAfterMonth)).map((_, index) => (
          <ItemWrapper item xs={1} key={index}>
            <Item sx={{ bgcolor: '#0f0' }}>{index + 1}</Item>
          </ItemWrapper>
        ))}
      </Grid>
    </Box>
  );
}

export default MonthView;
