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

const calculateDifference = (startDate, endDate, prefix = '') => {
  const formattedPrefix = prefix ? `${prefix} ` : '';
  const dateTimeStart = dayjs.utc(startDate);
  const dateTimeEnd = dayjs.utc(endDate);
  return `${formattedPrefix}${dateTimeEnd.from(dateTimeStart)}`;
};

const calculateTimeDifference = (dateTimeArray, prefix = '') => {
  if (dateTimeArray.length <= 1) {
    return '';
  }
  return calculateDifference(dateTimeArray[0], dateTimeArray[1], prefix);
};

export default calculateTimeDifference;
