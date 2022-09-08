import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import config from '../config';
import { DATE_FORMATS, UNITS, STRINGS } from '../constants';

const formatField = (fieldType, content) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', { relativeTime: config.dayjsConfig.relativeTime });

  if (!content && content !== 0) {
    return STRINGS.UNKNOWN_TEXT;
  }
  // TODO:
  if (content === STRINGS.UNKNOWN_TEXT) {
    return content;
  }

  let result;
  switch (true) {
    case fieldType.includes(UNITS.DISTANCE.value):
      result = `${content}${UNITS.DISTANCE.unit}`;
      break;
    case fieldType.includes(UNITS.WEIGHT.value):
      result = `${content}${UNITS.WEIGHT.unit}`;
      break;
    case fieldType.includes(UNITS.CURRENCY.value):
      result = `${UNITS.CURRENCY.unit}${content}`;
      break;
    case fieldType.includes(UNITS.SHORT_DATE_ALT.value):
      result = dayjs(0).add(content, UNITS.SHORT_DATE_ALT.unit).format(DATE_FORMATS.SHORT_ALT);
      break;
    case fieldType.includes(UNITS.SHORT_DATE.value):
      result = dayjs(0).add(content, UNITS.SHORT_DATE.unit).format(DATE_FORMATS.SHORT);
      break;
    case fieldType.includes(UNITS.BOOKING_DATETIME.value): {
      const splitBookingDateTime = content.split(',');
      const bookingDateTime = dayjs.utc(splitBookingDateTime[0]); // This can also act as the check-in time
      if (splitBookingDateTime.length < 2) {
        result = bookingDateTime.format(DATE_FORMATS.LONG);
      } else {
        const scheduledDepartureTime = dayjs.utc(splitBookingDateTime[1]); // This can also act as the eta
        const difference = scheduledDepartureTime.from(bookingDateTime);
        result = `${bookingDateTime.format(DATE_FORMATS.LONG)}, ${difference}`;
      }
      break;
    }
    case fieldType.includes(UNITS.DATETIME.value):
      result = dayjs.utc(content).format(DATE_FORMATS.LONG);
      break;
    default:
      result = content;
  }

  if (fieldType.includes(UNITS.CHANGED.value)) {
    result = <span className="task-versions--highlight">{result}</span>;
  }
  return result;
};

const formatKey = (fieldType, content) => {
  return (
    <>
      {fieldType.includes(UNITS.CHANGED.value)
        ? <span className="govuk-grid-key font__light task-versions--highlight">{content}</span>
        : <span className="govuk-grid-key font__light">{content}</span>}
    </>
  );
};

const formatLinkField = (fieldType, content, linkUrl) => {
  return (<a href={linkUrl} target="_blank" rel="noreferrer noopener">{formatField(fieldType, content)}</a>);
};

const FieldFormatterUtil = {
  link: {
    add: formatLinkField,
  },
  format: {
    field: formatField,
    key: formatKey,
  },
};

export default FieldFormatterUtil;

export { formatLinkField, formatField, formatKey };
