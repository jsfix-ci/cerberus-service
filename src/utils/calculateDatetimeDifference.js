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

export default targetDatetimeDifference;
