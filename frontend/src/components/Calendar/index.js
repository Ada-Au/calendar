import React, { useState } from 'react';
import MonthView from './monthView';

function Calendar() {
  const date = new Date();
  const [month, setMonth] = useState(new Date().getMonth());

  return <MonthView diff={date.getMonth() - month} />;
}

export default Calendar;
