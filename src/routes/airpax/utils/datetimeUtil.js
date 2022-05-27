import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const getFormattedDate = (date, dateFormat) => {
  return dayjs.utc(date).format(dateFormat);
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
