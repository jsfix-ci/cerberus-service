// Third party imports
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import config from '../config';
import { AFTER_TRAVEL_TEXT, AGO_TEXT, BEFORE_TRAVEL_TEXT, UNKNOWN_TEXT } from '../constants';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { relativeTime: config.dayjsConfig.relativeTime });

const toRelativeTime = (date) => {
  if (!date) {
    return UNKNOWN_TEXT;
  }
  const dateTimeStart = dayjs.utc(date);
  return dateTimeStart.fromNow();
};

const isInPast = (date) => {
  if (date && date !== UNKNOWN_TEXT) {
    return toRelativeTime(date)?.endsWith(AGO_TEXT);
  }
  return UNKNOWN_TEXT;
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
  isPast: isInPast,
  relativeTime: toRelativeTime,
};

export default DateTimeUtil;

export { calculateTimeDifference, isInPast, toRelativeTime };
