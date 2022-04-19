export function formatDate(dateVal) {
  var newDate = new Date(dateVal);

  var sMonth = padValue(newDate.getMonth() + 1);
  var sDay = padValue(newDate.getDate());
  var sYear = newDate.getFullYear();
  var sHour = newDate.getHours();
  var sMinute = padValue(newDate.getMinutes());
  var iHourCheck = parseInt(sHour);
  var sAMPM = 'am';

  if (iHourCheck > 12) {
    sAMPM = 'pm';
    sHour = iHourCheck - 12;
  } else if (iHourCheck === 0) {
    sHour = '12';
  }

  sHour = padValue(sHour);

  return `${sMonth}/${sDay}/${sYear} ${sHour}:${sMinute} ${sAMPM}`;
}

function padValue(value) {
  return value < 10 ? '0' + value : value;
}

export function compareDate(a, b, status = 0) {
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  // status: 0 for equals, 1 for bigger, -1 for smaller
  if (status === 1) return a.getTime() >= b.getTime();
  else if (status === -1) return a.getTime() <= b.getTime();
  return a.getTime() === b.getTime();
}
