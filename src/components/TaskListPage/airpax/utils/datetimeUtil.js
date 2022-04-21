import dayjs from 'dayjs';

const getFormattedDate = (date, dateFormat) => {
  return dayjs.utc(date).local().format(dateFormat);
};

const toDateTimeList = (dateOne, dateTwo) => {
  return [dateOne, dateTwo];
};

const DateTimeUtil = {
  format: getFormattedDate,
  toList: toDateTimeList,
};

export default DateTimeUtil;

export { getFormattedDate, toDateTimeList };
