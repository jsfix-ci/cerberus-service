import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AGO_TEXT, UNKNOWN_TEXT } from '../../../constants';

dayjs.extend(utc);
dayjs.extend(relativeTime);

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
  if (!date) {
    return UNKNOWN_TEXT;
  }
  const dateTimeStart = dayjs.utc(date);
  const currentDatetime = getDate(true);
  return dateTimeStart.from(currentDatetime);
};

const isInPast = (date) => {
  if (date && date !== UNKNOWN_TEXT) {
    return toRelativeTime(date)?.endsWith(AGO_TEXT);
  }
  return UNKNOWN_TEXT;
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
  isPast: isInPast,
  relativeTime: toRelativeTime,
};

export default DateTimeUtil;

export { getDate, getFormattedDate, toDateTimeList, toRelativeTime, isInPast };
