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
 * Calculate difference between booking date and departure date
 */
const targetDatetimeDifference = (bookingDatimeDifference) => {
  const datetimeArray = bookingDatimeDifference.split(',').filter((x) => x.length > 0);
  // Date at index 0, is the booking date.
  if (datetimeArray.length > 1) {
    const bookingDateTime = dayjs.utc(datetimeArray[0]);
    const scheduledDepartureTime = dayjs.utc(datetimeArray[1]);
    return `Booked ${scheduledDepartureTime.from(bookingDateTime)}`;
  }
  return '';
};

// TODO: Handle string spaces when prefix or suffix OR prefix || suffix is empty
/**
 * Calculate the time difference between two dates
 * @param dateOne First date
 * @param dateTwo Second date
 * @param prefix The prefix appended to the final output.
 * @param suffix The suffix appended to the final output.
 * @returns A date formatted string, including the supplied prefix & suffix.
 */
const calculateDateTimeDifference = (dateOne, dateTwo, prefix = '', suffix = '') => {
  if (!dateOne || !dateTwo) {
    return '';
  }
  const dateTimeOne = dayjs.utc(dateOne);
  const dateTimeTwo = dayjs.utc(dateTwo);
  return `${prefix} ${dateTimeTwo.from(dateTimeOne)} ${suffix}`;
};

export { targetDatetimeDifference, calculateDateTimeDifference };
