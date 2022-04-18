import React, { useEffect, useState } from 'react';
import {
  styled,
  Grid,
  Paper,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: '8px',
  color: theme.palette.text.secondary,
  userSelect: 'none',
  flex: 1,
}));

const ItemWrapper = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

function MonthView({ diff = 0 }) {
  const [monthDiff, setMonthDiff] = useState(diff);

  const DAY_IN_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const detailedDate = new Date();
  const year = detailedDate.getFullYear();
  const month = detailedDate.getMonth() + 1 + monthDiff;

  let dayBeforeMonth = new Date(year, month - 1, 0).getDay();
  if (dayBeforeMonth < 0) dayBeforeMonth += 7;

  // Default show 35 days, some months have included more that 5 weeks
  let showingDays =
    35 - dayBeforeMonth - new Date(year, month, 0).getDate() < 0 ? 42 : 35;

  const renderItem = (index, day) => {
    const showDate = new Date(year, month - 1, 1 + day - dayBeforeMonth);
    // month - showDate.getMonth(): 2 for before, 1 for current, 0 for after
    const style =
      month - showDate.getMonth() == 2
        ? { bgcolor: '#aff' }
        : month - showDate.getMonth() == 1
        ? {}
        : { bgcolor: '#afa' };

    // todo: get task
    const text =
      'test bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla';
    return (
      <ItemWrapper
        item
        xs={1}
        key={index}
        onMouseDown={handleMouseAction(
          true,
          new Date(year, month, index - dayBeforeMonth + 1)
        )}
        onMouseUp={handleMouseAction(
          false,
          new Date(year, month, index - dayBeforeMonth + 1)
        )}
      >
        <Item id={index} sx={style}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {showDate.getDate()}
            <Typography
              noWrap
              sx={{ overflow: 'hidden', width: '100%' }}
              variant="caption"
            >
              {text}
            </Typography>
          </div>
        </Item>
      </ItemWrapper>
    );
  };

  const handleMouseAction = (status, date) => () => {
    if (status) console.log('mouseDown', date.toLocaleString());
    else console.log('mouseUp', date.toLocaleString());
  };

  const handleChangeMonth = (change) => {
    setMonthDiff((prev) => prev + change);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, flex: 1 }}>
      <Grid container columns={{ xs: 12 }} sx={{ pb: 2 }}>
        <IconButton onClick={() => handleChangeMonth(-1)}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography>
          {year} {month}
        </Typography>
        <IconButton onClick={() => handleChangeMonth(1)}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
      <Grid container columns={{ xs: 7 }} sx={{ pb: 2 }}>
        {DAY_IN_WEEK.map((day, index) => (
          <Grid item xs={1} key={index}>
            <Item sx={{ bgcolor: '#ff0' }}>{day}</Item>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        columns={{ xs: 7 }}
        sx={{ height: '100%', gridAutoFlow: 'column' }}
      >
        {Array.from(Array(showingDays)).map((_, index) =>
          renderItem(index, index)
        )}
      </Grid>
    </Box>
  );
}

export default MonthView;
