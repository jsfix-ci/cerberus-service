import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { AFTER_TRAVEL_TEXT, AGO_TEXT, BEFORE_TRAVEL_TEXT, UNKNOWN_TEXT, UTC_DATE_REGEXS } from '../constants';
import config from '../config';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { relativeTime: config.dayjsConfig.relativeTime });

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

const calculateDifference = (startDate, endDate, prefix = '', suffix = '') => {
  const formattedPrefix = prefix ? `${prefix} ` : '';
  const dateTimeStart = dayjs.utc(startDate);
  const dateTimeEnd = dayjs.utc(endDate);
  let dateTimeDifference = `${dateTimeEnd.from(dateTimeStart)}`;
  if (suffix) {
    dateTimeDifference = dateTimeDifference
      .replace(AFTER_TRAVEL_TEXT, suffix)
      .replace(BEFORE_TRAVEL_TEXT, suffix)
      .replace(AGO_TEXT, suffix);
  }
  return `${formattedPrefix}${dateTimeDifference}`;
};

/**
 * Calculates the relative time difference between two given date times.
 *
 * @param {*} dateTimeArray An array containing two data times.
 * @param {*} prefix Text to append to the start of output.
 * @param {*} suffix Text to perform string replacement on suffix.
 * @returns A relative time text.
 */
const calculateTimeDifference = (dateTimeArray, prefix = '', suffix = '') => {
  if (dateTimeArray.length <= 1 || (!dateTimeArray[0] || !dateTimeArray[1])) {
    const formattedPrefix = prefix ? `${prefix} ` : '';
    return `${formattedPrefix}${UNKNOWN_TEXT}`;
  }
  return calculateDifference(dateTimeArray[0], dateTimeArray[1], prefix, suffix);
};

const DateTimeUtil = {
  calculateTimeDifference,
  convertToUTC: formatToUTCDate,
  date: getDate,
  format: getFormattedDate,
  isPast: isInPast,
  toList: toDateTimeList,
  relativeTime: toRelativeTime,
  validate: validateDate,
};

export default DateTimeUtil;

export { calculateTimeDifference,
  formatToUTCDate,
  getDate,
  getFormattedDate,
  isInPast,
  toDateTimeList,
  toRelativeTime,
  validateDate };
