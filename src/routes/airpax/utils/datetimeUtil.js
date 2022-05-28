import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UNKNOWN_TEXT } from '../../../constants';

dayjs.extend(utc);

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
  format: getFormattedDate,
  toList: toDateTimeList,
};

export default DateTimeUtil;

export { getFormattedDate, toDateTimeList };
