import React, { useState } from 'react';
import MonthView from './monthView';

function Calendar({ showDrawer }) {
  const date = new Date();
  const [month, setMonth] = useState(new Date().getMonth());

  return (
    <MonthView showTaskTime={!showDrawer} diff={date.getMonth() - month} />
  );
}

export default Calendar;
