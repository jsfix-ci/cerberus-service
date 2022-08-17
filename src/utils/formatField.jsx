import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import config from '../config';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT, SHORT_DATE_ALT, SHORT_DATE_FORMAT_ALT } from '../constants';

const formatField = (fieldType, content) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', { relativeTime: config.dayjsConfig.relativeTime });
  if (!content) {
    return 'Unknown';
  }
  let result;

  switch (true) {
    case fieldType.includes('DISTANCE'):
      result = `${content}m`;
      break;
    case fieldType.includes('WEIGHT'):
      result = `${content}kg`;
      break;
    case fieldType.includes('CURRENCY'):
      result = `£${content}`;
      break;
    case fieldType.includes(SHORT_DATE_ALT):
      result = dayjs(0).add(content, 'days').format(SHORT_DATE_FORMAT_ALT);
      break;
    case fieldType.includes('SHORT_DATE'):
      result = dayjs(0).add(content, 'days').format(SHORT_DATE_FORMAT);
      break;
    case fieldType.includes('BOOKING_DATETIME'): {
      const splitBookingDateTime = content.split(',');
      const bookingDateTime = dayjs.utc(splitBookingDateTime[0]); // This can also act as the check-in time
      if (splitBookingDateTime.length < 2) {
        result = bookingDateTime.format(LONG_DATE_FORMAT);
      } else {
        const scheduledDepartureTime = dayjs.utc(splitBookingDateTime[1]); // This can also act as the eta
        const difference = scheduledDepartureTime.from(bookingDateTime);
        result = `${bookingDateTime.format(LONG_DATE_FORMAT)}, ${difference}`;
      }
      break;
    }
    case fieldType.includes('DATETIME'):
      result = dayjs.utc(content).format(LONG_DATE_FORMAT);
      break;
    default:
      result = content;
  }

  if (fieldType.includes('CHANGED')) {
    result = <span className="task-versions--highlight">{result}</span>;
  }
  return result;
};

const formatKey = (fieldType, content) => {
  return (
    <>
      {fieldType.includes('CHANGED') ? <span className="govuk-grid-key font__light task-versions--highlight">{content}</span> : <span className="govuk-grid-key font__light">{content}</span>}
    </>
  );
};

const formatLinkField = (fieldType, content, linkUrl) => {
  return (<a href={linkUrl} target="_blank" rel="noreferrer noopener">{formatField(fieldType, content)}</a>);
};

export { formatLinkField, formatField, formatKey };
