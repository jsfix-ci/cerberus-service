import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AGO_TEXT, UNKNOWN_TEXT, UTC_DATE_REGEXS } from '../../../constants';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const validateDate = (date) => {
  return !!(date !== UNKNOWN_TEXT && date && UTC_DATE_REGEXS.some((regex) => regex.test(date)));
};

/**
 * This will return either a formatted UTC datetime or a dayjs datetime object.
 * @param {*} asDayjsObj Flag to determine whether to return a formatted UTC datetime or a dayjs datetime object.
 * @returns A UTC formatted time or a dayjs datetime object.
 */
const getDate = (asDayjsObj = false) => {
  if (asDayjsObj) {
    return dayjs.utc();
  }
  return dayjs.utc().format();
};

const toRelativeTime = (date) => {
  if (!validateDate(date)) {
    return UNKNOWN_TEXT;
  }
  const dateTimeStart = dayjs.utc(date);
  return dateTimeStart.fromNow();
};

const isInPast = (date) => {
  if (!validateDate(date)) {
    return UNKNOWN_TEXT;
  }
  return toRelativeTime(date)?.endsWith(AGO_TEXT);
};

const getFormattedDate = (date, dateFormat) => {
  if (!validateDate(date)) {
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
  isPast: isInPast,
  relativeTime: toRelativeTime,
  validate: validateDate,
};

export default DateTimeUtil;

export { getDate, getFormattedDate, toDateTimeList, toRelativeTime, isInPast, validateDate as isValid };
