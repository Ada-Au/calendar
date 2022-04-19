import React, { useLayoutEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
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
import AddIcon from '@mui/icons-material/Add';

import { DAY_IN_WEEK, DAY_IN_WEEK_STYLE, MONTH_IN_YEAR } from '../constants';
import MonthItem from './MonthItem';
import LoadingSpinner from '../../LoadingSpinner';

const MY_TASKS = gql`
  query MyTasks($month: Int!, $year: Int!) {
    myTasks(month: $month, year: $year) {
      id
      title
      startTime
      endTime
      isFullDay
    }
  }
`;

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: '8px',
  color: theme.palette.text.secondary,
  userSelect: 'none',
  flex: 1,
  borderRadius: '2px',
}));

const ActionWrapper = styled(Box)(() => ({
  paddingBottom: '8px',
  alignItems: 'center',
  flexDirection: 'row',
  display: 'flex',
}));

const CalendarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dayBefore' || prop !== 'date',
})(({ dayBefore, date }) => ({
  display: 'grid',
  overflow: 'hidden',
  height: '100%',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: `repeat(${
    35 - dayBefore - date.getDate() < 0 ? 6 : 5
  }, 1fr)`,
}));

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  flex: 1,
  overflowY: 'auto',
}));

// todo: show task time when hide drawer
function MonthView({ diff = 0, showTaskTime }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState({});
  const [dayBeforeMonth, setDayBeforeMonth] = useState({});
  const [viewingDate, setViewingDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1 + diff, 0)
  );

  const [myTasks, { data, loading, error }] = useLazyQuery(MY_TASKS);

  useLayoutEffect(() => {
    let dayBefore =
      new Date(viewingDate.getFullYear(), viewingDate.getMonth(), 0).getDay() +
      1; // +1 to start at sun
    if (dayBefore >= 7) dayBefore -= 7;
    setDayBeforeMonth(dayBefore);

    myTasks({
      variables: {
        month: viewingDate.getMonth(),
        year: viewingDate.getFullYear(),
      },
    });
  }, [viewingDate]);

  const handleChangeMonth = (change) => {
    setSelectedDate({});
    myTasks({
      variables: {
        month: viewingDate.getMonth() + change,
        year: viewingDate.getFullYear(),
      },
    });
    setViewingDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1 + change, 0)
    );
  };

  const handleChangeSelect = (prop, date, end) => {
    if (prop === 'start')
      setSelectedDate({ ...selectedDate, start: date, end });
    else setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const handleCreate = () => {
    navigate('/createTask', {
      state: { start: selectedDate.start, end: selectedDate.end },
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    console.log('error', error);
    // todo: error page
    return;
  }

  return (
    <Wrapper>
      <ActionWrapper>
        <IconButton onClick={() => handleChangeMonth(-1)}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography onClick={() => console.log('todo: add year view')}>
          {viewingDate.getFullYear()} {MONTH_IN_YEAR[viewingDate.getMonth()]}
        </Typography>
        <IconButton onClick={() => handleChangeMonth(1)}>
          <ArrowForwardIosIcon />
        </IconButton>
        <IconButton onClick={handleCreate} sx={{ ml: 'auto' }}>
          <AddIcon />
        </IconButton>
      </ActionWrapper>

      <Grid container columns={{ xs: 7 }} sx={{ pb: 2 }}>
        {DAY_IN_WEEK.map((day) => (
          <Grid item xs={1} key={day}>
            <Item sx={DAY_IN_WEEK_STYLE}>{day}</Item>
          </Grid>
        ))}
      </Grid>

      <CalendarWrapper dayBefore={dayBeforeMonth} date={viewingDate}>
        {Array.from(
          // Default show 35 days, some months have included more that 5 weeks
          Array(35 - dayBeforeMonth - viewingDate.getDate() < 0 ? 42 : 35)
        ).map((_, index) => (
          <MonthItem
            key={index}
            index={index}
            selectedDate={selectedDate}
            onChange={handleChangeSelect}
            viewingDate={viewingDate}
            tasks={data?.myTasks}
            dayBeforeMonth={dayBeforeMonth}
          />
        ))}
      </CalendarWrapper>
    </Wrapper>
  );
}

export default MonthView;
