import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UNKNOWN_TEXT } from '../../../constants';

dayjs.extend(utc);

const getDate = () => {
  return dayjs.utc().format();
};

const getFormattedDate = (date, dateFormat) => {
  if (!date) {
    return UNKNOWN_TEXT;
  }
  return dayjs.utc(date).format(dateFormat);
};

const toDateTimeList = (dateOne, dateTwo) => {
  return [dateOne, dateTwo];
};

const DateTimeUtil = {
  date: getDate,
  format: getFormattedDate,
  toList: toDateTimeList,
};

export default DateTimeUtil;

export { getDate, getFormattedDate, toDateTimeList };
