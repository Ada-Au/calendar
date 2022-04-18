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
import {
  DAY_IN_WEEK,
  DAY_IN_WEEK_STYLE,
  NON_WEEKDAY_STYLE,
  WEEKDAY_STYLE,
  NON_CURRENT_MONTH_STYLE,
  CURRENT_MONTH_STYLE,
  MONTH_IN_YEAR,
  HOVER_STYLE,
  SELECT_STYLE,
  TODAY_STYLE,
} from './constants';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: '8px',
  color: theme.palette.text.secondary,
  userSelect: 'none',
  flex: 1,
  borderRadius: '2px',
}));

const ItemWrapper = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const TextWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

// todo: show task time when hide drawer
function MonthView({ diff = 0, showTaskTime }) {
  const [firstSelect, setFirstSelect] = useState();
  const [hoverSelect, setHoverSelect] = useState();
  const [secSelect, setSecSelect] = useState();
  const [monthDiff, setMonthDiff] = useState(diff);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + monthDiff;
  const viewingDate = new Date(year, month + 1, 0);

  let dayBeforeMonth = new Date(year, month, 0).getDay() + 1; // +1 to start at sun
  if (dayBeforeMonth >= 7) dayBeforeMonth -= 7;

  // Default show 35 days, some months have included more that 5 weeks
  let showingDays =
    35 - dayBeforeMonth - new Date(year, month + 1, 0).getDate() < 0 ? 42 : 35;

  const renderItem = (index) => {
    const showDate = new Date(year, month, 1 + index - dayBeforeMonth);
    const showDateTime = showDate.getTime();
    const monthDiff = showDate.getMonth() - month;

    let style = {};
    if (
      monthDiff == -1 ||
      monthDiff == 11 || // 11 for before Jan (12 - 1)
      monthDiff == 1 ||
      monthDiff == 13 // 13 for after Dec (12 - -1)
    )
      style = NON_CURRENT_MONTH_STYLE;
    else style = CURRENT_MONTH_STYLE;

    if (showDate.getDay() == 6 || showDate.getDay() == 0)
      style = { ...style, ...NON_WEEKDAY_STYLE };
    else style = { ...style, ...WEEKDAY_STYLE };

    if (
      showDate.getFullYear() == year &&
      showDate.getMonth() == month &&
      showDate.getDate() == today.getDate()
    )
      style = { ...style, ...TODAY_STYLE };

    if (firstSelect && hoverSelect)
      if (!secSelect) {
        if (firstSelect > hoverSelect) {
          if (showDateTime >= hoverSelect && showDateTime < firstSelect)
            style = { ...style, ...HOVER_STYLE };
        } else {
          if (showDateTime <= hoverSelect && showDateTime > firstSelect)
            style = { ...style, ...HOVER_STYLE };
        }
      } else {
        if (showDateTime > firstSelect && showDateTime < secSelect)
          style = { ...style, ...HOVER_STYLE };
      }

    if (hoverSelect == showDateTime) {
      style = { ...style, ...HOVER_STYLE };
    }

    if (
      (firstSelect && showDateTime == firstSelect) ||
      (secSelect && showDateTime == secSelect)
    ) {
      style = { ...style, ...SELECT_STYLE };
    }

    // todo: get task
    const text =
      'test bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla';
    return (
      <ItemWrapper
        item
        xs={1}
        key={index}
        onMouseDown={handleMouseDown(showDate.getTime())}
        onMouseUp={handleMouseUp(showDate.getTime())}
        onMouseOver={handleMouseOver(showDate.getTime())}
      >
        <Item id={index} sx={style}>
          <TextWrapper>
            {showDate.getDate()}
            <Typography
              noWrap
              sx={{ overflow: 'hidden', width: '100%' }}
              variant="caption"
            >
              {text}
            </Typography>
          </TextWrapper>
        </Item>
      </ItemWrapper>
    );
  };

  const handleMouseDown = (date) => () => {
    if (!firstSelect || date != firstSelect) {
      setFirstSelect(date);
      setSecSelect(null);
    }
  };

  const handleMouseUp = (date) => () => {
    if (!secSelect || date != secSelect) {
      if (date < firstSelect) {
        setSecSelect(firstSelect);
        setFirstSelect(date);
      } else setSecSelect(date);
    }
  };

  const handleMouseOver = (date) => () => {
    if (!hoverSelect || date != hoverSelect) {
      setHoverSelect(date);
    }
  };

  const handleChangeMonth = (change) => {
    setMonthDiff((prev) => prev + change);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, flex: 1 }}>
      <Grid
        container
        columns={{ xs: 12 }}
        sx={{ pb: 2, alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <IconButton onClick={() => handleChangeMonth(-1)}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography onClick={() => console.log('todo: add year view')}>
          {viewingDate.getFullYear()} {MONTH_IN_YEAR[viewingDate.getMonth()]}
        </Typography>
        <IconButton onClick={() => handleChangeMonth(1)}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
      <Grid container columns={{ xs: 7 }} sx={{ pb: 2 }}>
        {DAY_IN_WEEK.map((day) => (
          <Grid item xs={1} key={day}>
            <Item sx={DAY_IN_WEEK_STYLE}>{day}</Item>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        columns={{ xs: 7 }}
        sx={{ height: '100%', gridAutoFlow: 'column' }}
      >
        {Array.from(Array(showingDays)).map((_, index) => renderItem(index))}
      </Grid>
    </Box>
  );
}

export default MonthView;
