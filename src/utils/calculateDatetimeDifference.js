// Third party imports
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import config from '../config';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { relativeTime: config.dayjsConfig.relativeTime });

/**
 * Calculate the time difference between two dates
 *
 * @param startDate Start date
 * @param endDate End date
 * @param prefix The prefix appended to the final output (if provided).
 * @param suffix The suffix appended to the final output (if provided).
 * @returns A date formatted string, including the supplied prefix & suffix OR an empty string.
 */
const calculateDifference = (startDate, endDate, prefix = '', suffix = '') => {
  const formattedPrefix = prefix ? `${prefix} ` : '';
  const formattedSuffix = suffix ? ` ${suffix}` : '';
  const dateTimeStart = dayjs.utc(startDate);
  const dateTimeEnd = dayjs.utc(endDate);
  return `${formattedPrefix}${dateTimeEnd.from(dateTimeStart)}${formattedSuffix}`;
};

const calculateTimeDifference = (dateTimeArray, prefix = '', suffix = '') => {
  if (dateTimeArray.length === 1) {
    return '';
  }
  return calculateDifference(dateTimeArray[0], dateTimeArray[1], prefix, suffix);
};

export default calculateTimeDifference;
