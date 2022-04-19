import React from 'react';
import { styled, Grid, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CircleIcon from '@mui/icons-material/Circle';

import {
  NON_WEEKDAY_STYLE,
  WEEKDAY_STYLE,
  NON_CURRENT_MONTH_STYLE,
  CURRENT_MONTH_STYLE,
  HOVER_STYLE,
  SELECT_STYLE,
  TODAY_STYLE,
} from '../constants';
import { compareDate } from '../../DateManager';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: '8px',
  color: theme.palette.text.secondary,
  userSelect: 'none',
  borderRadius: '2px',
  height: '100%',
}));

const Wrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
  alignItems: 'center',
}));

function MonthItem({
  index,
  showTaskTime,
  viewingDate,
  selectedDate,
  dayBeforeMonth,
  tasks,
  onChange,
}) {
  const navigate = useNavigate();
  const showDate = new Date(
    viewingDate.getFullYear(),
    viewingDate.getMonth(),
    1 + index - dayBeforeMonth
  );
  const monthDiff = showDate.getMonth() - viewingDate.getMonth();
  const time = showDate.getTime();

  const handleSelectTask = (id) => (e) => {
    navigate(`/task/${id}`);
    e.stopPropagation();
  };

  const handleMouseDown = () => {
    if (!selectedDate.start || time !== selectedDate.start) {
      onChange('start', time, null);
    }
  };

  const handleMouseUp = () => {
    if (!selectedDate.end || time !== selectedDate.end) {
      if (time < selectedDate.start) {
        onChange('start', time, selectedDate.start);
      } else onChange('end', time);
    }
  };

  const handleMouseOver = () => {
    if (!selectedDate.over || time !== selectedDate.over) {
      onChange('over', time);
    }
  };

  let style = {};
  if (
    monthDiff === -1 ||
    monthDiff === 11 || // 11 for before Jan (12 - 1)
    monthDiff === 1 ||
    monthDiff === 13 // 13 for after Dec (12 - -1)
  )
    style = NON_CURRENT_MONTH_STYLE;
  else style = CURRENT_MONTH_STYLE;

  if (showDate.getDay() === 6 || showDate.getDay() === 0)
    style = { ...style, ...NON_WEEKDAY_STYLE };
  else style = { ...style, ...WEEKDAY_STYLE };

  if (compareDate(showDate, new Date())) style = { ...style, ...TODAY_STYLE };

  if (selectedDate.start && selectedDate.over)
    if (!selectedDate.end) {
      if (selectedDate.start > selectedDate.over) {
        if (time >= selectedDate.over && time < selectedDate.start)
          style = { ...style, ...HOVER_STYLE };
      } else {
        if (time <= selectedDate.over && time > selectedDate.start)
          style = { ...style, ...HOVER_STYLE };
      }
    } else {
      if (time > selectedDate.start && time < selectedDate.end)
        style = { ...style, ...HOVER_STYLE };
    }

  if (selectedDate.over === time) {
    style = { ...style, ...HOVER_STYLE };
  }

  if (
    (selectedDate.start && time === selectedDate.start) ||
    (selectedDate.end && time === selectedDate.end)
  ) {
    style = { ...style, ...SELECT_STYLE };
  }

  let todayTask;
  if (tasks)
    todayTask = tasks.filter((task) =>
      task.isFullDay
        ? compareDate(new Date(task.startTime), showDate)
        : compareDate(new Date(task.startTime), showDate, -1) &&
          compareDate(new Date(task.endTime), showDate, 1)
    );

  return (
    <Box
      key={index}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOver={handleMouseOver}
      style={{ minWidth: 0, width: '100%', minHeight: 0 }}
    >
      <Item id={index} sx={style}>
        {showDate.getDate()}
        {todayTask &&
          todayTask.slice(0, todayTask.length == 4 ? 4 : 3).map((task) => (
            <Wrapper>
              <CircleIcon sx={{ fontSize: '6px', color: 'primary', mr: 0.5 }} />
              <Typography
                noWrap
                sx={{
                  overflow: 'hidden',
                  width: '100%',
                  overflowWrap: 'break-word',
                }}
                variant="caption"
                onClick={handleSelectTask(task.id)}
              >
                {task.title}
              </Typography>
            </Wrapper>
          ))}
        {todayTask && todayTask.length > 4 && (
          <Typography variant="caption">
            {/* todo: show all task in day */}
            {todayTask.length - 3} more...
          </Typography>
        )}
      </Item>
    </Box>
  );
}

export default MonthItem;
