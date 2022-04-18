import React from 'react';
import Calendar from 'react-calendar';
import './calendar.css';

function CustomCalendar() {
  const onChange = (e) => {
    console.log('onChange', e);
  };
  return <Calendar onChange={onChange} />;
}

export default CustomCalendar;
