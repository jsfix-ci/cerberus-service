import dayjs from 'dayjs';
import config from '../../../../config';

const getFormattedDate = (date, dateFormat) => {
  return dayjs.utc(date).tz(config.dayjsConfig.timezone).format(dateFormat);
};

const toDateTimeList = (dateOne, dateTwo) => {
  return [dateOne, dateTwo];
};

const DateTimeUtil = {
  format: getFormattedDate,
  toList: toDateTimeList,
};

export default DateTimeUtil;

export { getFormattedDate, toDateTimeList };
