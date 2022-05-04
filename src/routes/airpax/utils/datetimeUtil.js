import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import config from '../../../config';
import { UNKNOWN_TIME_DATA } from '../../../constants';
import { isNotNumber } from '../../../utils/roroDataUtil';

dayjs.extend(utc);
dayjs.extend(timezone);

const getFormattedDate = (date, dateFormat) => {
  const tz = config.dayjsConfig.timezone || dayjs.tz.guess();
  return dayjs.utc(date).tz(tz).format(dateFormat);
};

const toDateTimeList = (dateOne, dateTwo) => {
  return [dateOne, dateTwo];
};

function toTimeObject(milliseconds) {
  if (!milliseconds) {
    return UNKNOWN_TIME_DATA;
  }

  if (isNotNumber(milliseconds)) {
    return UNKNOWN_TIME_DATA;
  }

  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  return { h: hours, m: minutes, s: seconds };
}

const DateTimeUtil = {
  format: getFormattedDate,
  toList: toDateTimeList,
  toTime: toTimeObject,
};

export default DateTimeUtil;

export { getFormattedDate, toDateTimeList, toTimeObject };
