import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import config from '../../../../config';

const getFormattedDate = (date, dateFormat) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return dayjs.utc(date).tz(config.dayjsConfig.timezone).format(dateFormat);
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
