import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AGO_TEXT, UNKNOWN_TEXT, UTC_DATE_REGEXS } from '../../../constants';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

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

const formatToUTCDate = (date, inputFormat, outputFormat) => {
  if (!date) {
    return UNKNOWN_TEXT;
  }
  return dayjs.utc(date, inputFormat).format(outputFormat);
};

const toDateTimeList = (dateOne, dateTwo) => {
  return [dateOne, dateTwo];
};

const DateTimeUtil = {
  convertToUTC: formatToUTCDate,
  date: getDate,
  format: getFormattedDate,
  isPast: isInPast,
  toList: toDateTimeList,
  relativeTime: toRelativeTime,
  validate: validateDate,
};

export default DateTimeUtil;

export { formatToUTCDate, getDate, getFormattedDate, isInPast, toDateTimeList, toRelativeTime, validateDate };
