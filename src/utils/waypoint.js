import dayjs from 'dayjs';

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 1440;
const TIME_COUNT = 10;

const humanizeTime = (date) => dayjs(date).format('HH:mm');
const humanizeDate = (date) => dayjs(date).format('MMM D');
const humanizeFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const calculateDuration = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  const diff = date2.diff(date1, 'minute');

  let duration = '';
  let amountOfHours = 0;

  if (diff >= MINUTES_PER_DAY) {
    const amountOfDays = Math.trunc(diff / MINUTES_PER_DAY);

    if (amountOfDays < TIME_COUNT) {
      duration += '0';
    }
    duration += `${amountOfDays}D `;

    amountOfHours = diff % MINUTES_PER_DAY;

    amountOfHours = amountOfHours >= MINUTES_PER_HOUR ? amountOfHours = Math.trunc(amountOfHours / MINUTES_PER_HOUR) : 0;

    if (amountOfHours < TIME_COUNT) {
      duration += '0';
    }
    duration += `${amountOfHours}H `;
  } else if (diff >= MINUTES_PER_HOUR) {
    amountOfHours = Math.trunc(diff / MINUTES_PER_HOUR);
    if (amountOfHours < TIME_COUNT) {
      duration += '0';
    }
    duration += `${amountOfHours}H `;
  }

  const amountOfMinutes = diff % MINUTES_PER_HOUR;
  if (amountOfMinutes < TIME_COUNT) {
    duration += '0';
  }
  duration += `${amountOfMinutes}M`;

  return duration;
};

const sortByTime = (a, b) => {
  const aDiff = dayjs(a.dateTo).diff(dayjs(a.dateFrom), 'minutes');
  const bDiff = dayjs(b.dateTo).diff(dayjs(b.dateFrom), 'minutes');
  return bDiff - aDiff;
};

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

const sortByDay = (a, b) => {
  const bDate = dayjs(b.dateFrom).format('D');
  const aDate = dayjs(a.dateFrom).format('D');
  const diff = aDate - bDate;
  if (diff !== 0) {
    return diff;
  } else {
    const bTime = dayjs(b.dateFrom).format('H');
    const aTime = dayjs(a.dateFrom).format('H');
    return aTime - bTime;
  }
};

const compareTime = (object, element) => {
  const date1 = dayjs(object.dateFrom);
  const date2 = dayjs(object.dateTo);
  const diff = date2.diff(date1, 'minutes');
  if (diff < 0) {
    element.querySelector('.event__save-btn').disabled = true;
  }
};

const isDatesEqual = (dateA, dateB) => (dayjs(dateA.dateFrom).isSame(dateB.dateFrom, 'minutes')) && (dayjs(dateA.dateTo).isSame(dateB.dateTo, 'minutes'));

export {humanizeDate, humanizeTime, calculateDuration, humanizeFullDate, sortByTime, sortByPrice, compareTime, isDatesEqual, sortByDay};
