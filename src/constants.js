export const LONG_DATE_FORMAT = 'D MMM YYYY [at] HH:mm';
export const LONG_DAY_DATE_FORMAT = 'ddd D MMM YYYY [at] HH:mm';
export const SHORT_DATE_FORMAT = 'DD/MM/YYYY';
export const SHORT_DATE_FORMAT_ALT = 'DD MMM YYYY';
export const SHORT_DATE_ALT = 'SHORT_DATE_ALT';
export const STANDARD_HOUR_MINUTE_FORMAT = 'HH:mm';
export const STANDARD_CARD_EXPIRY_FORMAT = 'MM/YY';
export const LONDON_TIMEZONE = 'Europe/London';
export const TASK_STATUS_NEW = 'new';
export const TASK_STATUS_IN_PROGRESS = 'inProgress';
export const TASK_STATUS_TARGET_ISSUED = 'issued';
export const TASK_STATUS_COMPLETED = 'complete';
export const TASK_OUTCOME_POSITIVE = 'positive';
export const TASK_OUTCOME_NEGATIVE = 'negative';
export const TASK_OUTCOME_NO_SHOW = 'noShow';
export const TASK_OUTCOME_MISSED = 'missed';
export const TASK_OUTCOME_INSUFFICIENT_RESOURCES = 'insufficientResources';
export const TASK_OUTCOME_TARGET_WITHDRAWN = 'targetWithdrawn';
export const TARGETER_GROUP = '/bf-intel-targeters';
export const RORO_TOURIST = 'RORO_TOURIST';
export const RORO_UNACCOMPANIED_FREIGHT = 'RORO_UNACCOMPANIED_FREIGHT';
export const RORO_ACCOMPANIED_FREIGHT = 'RORO_ACCOMPANIED_FREIGHT';
export const RORO_TOURIST_CAR_ICON = 'c-icon-car';
export const INDIVIDUAL_ICON = 'c-icon-person';
export const GROUP_ICON = 'c-icon-group';
export const RORO_UNACCOMPANIED_ICON = 'c-icon-trailer';
export const RORO_ACCOMPANIED_ICON = 'c-icon-hgv';
export const RORO_VAN_ICON = 'c-icon-van';
export const RORO_NO_ICON = '';
export const DEFAULT_DATE_TIME_STRING_PREFIX = 'Booked';
export const MOVEMENT_DESCRIPTION_INDIVIDUAL = 'individual';
export const MOVEMENT_DESCRIPTION_GROUP = 'group';
export const MOVEMENT_MODE_AIR_PASSENGER = 'AIR_PASSENGER';
export const MOVEMENT_MODE_AIR_CREW = '_TBC_';
export const UNKNOWN_TEXT = 'Unknown';
export const A_TITLE_CASE_TEXT = 'A ';
export const A_SMALL_TEXT = 'a ';
export const AN_TITLE_CASE_TEXT = 'An ';
export const AN_SMALL_TEXT = 'an ';
export const LATER_TEXT = 'later';
export const ARRIVAL_TEXT = 'Arrival';
export const AGO_TEXT = 'ago';
export const AFTER_TRAVEL_TEXT = 'after travel';
export const BEFORE_TRAVEL_TEXT = 'before travel';
export const DAYJS_PAST = 'ago';
export const DAYJS_FUTURE = 'before travel';
export const DAYJS_FUTURE_AIXPAX_REPLACE = 'before departure';
export const FONT_CLASSES = {
  0: 'font__bold',
  1: 'font__light',
};
export const UNKNOWN_TIME_DATA = { h: null, m: null, s: null };
export const CO_TRAVELLERS_TABLE_HEADERS = [
  'Traveller',
  'Age',
  'Check-in',
  'Seat',
  'Document',
  'Checked baggage',
  '',
];
export const WARNING_CODES_MAPPING = {
  VIOL: 'Violence',
  FIRE: 'Firearms',
  WEAP: 'Weapons',
  CTGN: 'Contagion',
  SEH: 'Self Harm',
};
export const NO_TEXT = 'No';
export const YES_TEXT = 'Yes';
export const CURRENTLY_UNAVAILABLE_TEXT = 'Currently unavailable';
export const RULES_FIELD_NAMES = {
  name: 'Rule name',
  priority: 'Threat',
  version: 'Rule Version',
  abuseTypes: 'Abuse Type',
};
export const RULES_FIELD_DESCRIPTION = {
  description: 'Description',
  agency: 'Agency',
};

export const BUSINESS_KEY_PATH = '/businessKey/generate';
export const FORM_NAMES = {
  NOTE_CERBERUS: 'noteCerberus',
  TARGET_INFORMATION_SHEET: 'targetInformationSheet',
};

export const DEPARTURE_STATUS = {
  DEPARTURE_CONFIRMED: {
    classname: 'green',
    description: 'Departure confirmed',
    code: 'DC',
  },
  BOOKED_PASSENGER: {
    classname: 'purple',
    description: 'Booked passenger',
    code: 'BP',
  },
  CHECKED_IN: {
    classname: 'blue',
    description: 'Checked-in',
    code: 'CI',
  },
  DEPARTURE_EXCEPTION: {
    classname: 'red',
    description: 'Departure exception',
    code: 'DX',
  },
};

export const NOTE_VARIANT = {
  RORO: 'RORO',
  AIRPAX: 'AIRPAX',
};
