import { BEFORE_TRAVEL_TEXT, RORO_TOURIST, UNKNOWN_TEXT } from '../constants';

import { hasVehicle, hasTrailer } from './roroDataUtil';
import DatetimeUtil from './datetimeUtil';

const INVALID_VALUES = [
  UNKNOWN_TEXT,
  null,
  undefined,
  'Invalid Date',
  'NaN'];

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatVoyageText = (dateTime) => {
  const time = DatetimeUtil.relativeTime(dateTime);
  const isPastDate = DatetimeUtil.isPast(dateTime);
  if (isPastDate !== UNKNOWN_TEXT) {
    if (isPastDate) {
      return `arrived ${time}`.trim();
    }
    return `arriving in ${time.replace(BEFORE_TRAVEL_TEXT, '')}`.trim();
  }
  return UNKNOWN_TEXT;
};

const formatMovementModeIconText = (roroData, movementMode) => {
  let output = '';
  if (movementMode === RORO_TOURIST) {
    output += hasVehicle(roroData.vehicle?.registrationNumber) ? 'Vehicle' : '';
  } else {
    output += hasVehicle(roroData.vehicle?.registrationNumber) ? 'Vehicle' : '';
    output += (hasVehicle(roroData.vehicle?.registrationNumber) && hasTrailer(roroData.vehicle?.trailer?.regNumber))
      ? ' with ' : '';
    output += hasTrailer(roroData?.vehicle?.trailer?.regNumber) ? 'Trailer' : '';
  }
  return output;
};

const escapeJSON = (input) => {
  if (!input && input !== 0) {
    return '';
  }
  const inputAsText = String(input);
  return inputAsText.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"');
};

const replaceInvalidValues = (value) => {
  if (INVALID_VALUES.includes(value)) {
    return '';
  }
  return value;
};

export { capitalizeFirstLetter,
  formatMovementModeIconText,
  escapeJSON,
  formatVoyageText,
  replaceInvalidValues };
