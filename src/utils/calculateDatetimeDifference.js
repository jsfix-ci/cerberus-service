// Third party imports
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import config from '../config';
import { AFTER_TRAVEL_TEXT, AGO_TEXT, BEFORE_TRAVEL_TEXT, UNKNOWN_TEXT, MOVEMENT_VARIANT } from '../constants';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', { relativeTime: config.dayjsConfig.relativeTime });

const daysJSRelativeTimeText = (dateTimeDifference, suffix = '') => {
  return dateTimeDifference
    .replace(AFTER_TRAVEL_TEXT, suffix)
    .replace(BEFORE_TRAVEL_TEXT, suffix)
    .replace(AGO_TEXT, suffix);
};

const calculateDifference = (startDate, endDate, prefix = '', suffix = '', mode) => {
  const formattedPrefix = prefix ? `${prefix} ` : '';
  const dateTimeStart = dayjs.utc(startDate);
  const dateTimeEnd = dayjs.utc(endDate);
  let dateTimeDifference = `${dateTimeEnd.from(dateTimeStart)}`;

  if (mode === MOVEMENT_VARIANT.AIRPAX) {
    if (dateTimeDifference.endsWith(BEFORE_TRAVEL_TEXT)) {
      return `arrival at ${formattedPrefix}in ${dateTimeDifference.replace(BEFORE_TRAVEL_TEXT, suffix)}`;
    }
    if (dateTimeDifference.endsWith(AGO_TEXT)) {
      return `arrived at ${formattedPrefix}${dateTimeDifference}`;
    }
  }
  if (suffix && mode === MOVEMENT_VARIANT.RORO) {
    dateTimeDifference = daysJSRelativeTimeText(dateTimeDifference, suffix);
  }
  return `${formattedPrefix}${dateTimeDifference}`;
};

const calculateTimeDifference = (dateTimeArray, prefix = '', suffix = '', mode = MOVEMENT_VARIANT.RORO) => {
  if (dateTimeArray.length <= 1 || (!dateTimeArray[0] || !dateTimeArray[1])) {
    const formattedPrefix = prefix ? `${prefix} ` : '';
    return `${formattedPrefix}${UNKNOWN_TEXT}`;
  }
  return calculateDifference(dateTimeArray[0], dateTimeArray[1], prefix, suffix, mode);
};

export default calculateTimeDifference;
