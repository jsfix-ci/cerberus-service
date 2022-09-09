import { STRINGS, MOVEMENT_MODES } from '../constants';

import { hasVehicle, hasTrailer } from '../Movement/movementUtil';
import DatetimeUtil from '../Datetime/datetimeUtil';

const INVALID_VALUES = [
  STRINGS.UNKNOWN_TEXT,
  null,
  undefined,
  'Invalid Date',
  'NaN'];

const formatAddress = (address) => {
  if (!address || address === STRINGS.UNKNOWN_TEXT) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return Object.keys(address)
    .filter((k) => k !== 'entitySearchUrl')
    .filter((k) => !!address[k])
    .map((k) => address[k])
    .join(', ');
};

const capitalizeString = (value) => {
  if (!value) {
    return value;
  }
  return value.toUpperCase();
};

const formatTaskStatusToCamelCase = (statusName) => {
  if (!statusName) {
    return statusName;
  }
  return statusName === 'IN_PROGRESS' ? 'inProgress' : statusName?.toLowerCase();
};

const formatTaskStatusToSnakeCase = (statusName) => {
  if (!statusName) {
    return statusName;
  }
  return statusName === 'inProgress' ? 'IN_PROGRESS' : statusName?.toUpperCase();
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatVoyageText = (dateTime) => {
  const time = DatetimeUtil.relativeTime(dateTime);
  const isPastDate = DatetimeUtil.isPast(dateTime);
  if (isPastDate !== STRINGS.UNKNOWN_TEXT) {
    if (isPastDate) {
      return `arrived ${time}`.trim();
    }
    return `arriving in ${time.replace(STRINGS.BEFORE_TRAVEL_TEXT, '')}`.trim();
  }
  return STRINGS.UNKNOWN_TEXT;
};

const formatMovementModeIconText = (roroData, movementMode) => {
  let output = '';
  if (movementMode === MOVEMENT_MODES.TOURIST) {
    output += hasVehicle(roroData?.vehicle?.registrationNumber) ? 'Vehicle' : '';
  } else {
    output += hasVehicle(roroData?.vehicle?.registrationNumber) ? 'Vehicle' : '';
    output += (hasVehicle(roroData?.vehicle?.registrationNumber) && hasTrailer(roroData?.vehicle))
      ? ' with ' : '';
    output += hasTrailer(roroData?.vehicle) ? 'Trailer' : '';
  }
  return output;
};

const escapeString = (input) => {
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

const StringUtil = {
  capitalize: capitalizeString,
  capitalizeFirst: capitalizeFirstLetter,
  escape: escapeString,
  format: {
    camelCase: formatTaskStatusToCamelCase,
    snakeCase: formatTaskStatusToSnakeCase,
    address: formatAddress,
  },
  modeIconText: formatMovementModeIconText,
  replaceInvalid: replaceInvalidValues,
  voyageText: formatVoyageText,
};

export default StringUtil;

export { capitalizeString,
  capitalizeFirstLetter,
  escapeString,
  formatAddress,
  formatMovementModeIconText,
  formatTaskStatusToCamelCase,
  formatTaskStatusToSnakeCase,
  formatVoyageText,
  replaceInvalidValues };
