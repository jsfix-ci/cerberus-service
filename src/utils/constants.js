export const DATE_FORMATS = {
  LONG: 'D MMM YYYY [at] HH:mm',
  LONG_DAY_DATE: 'ddd D MMM YYYY [at] HH:mm',
  SHORT: 'DD/MM/YYYY',
  SHORT_ALT: 'DD MMM YYYY',
  UTC: 'YYYY-MM-DDTHH:mm:ss[Z]',
  CUSTOM_HOUR_MINUTE: 'HH:mm',
  CUSTOM_CARD_EXPIRY: 'MM/YY',
};

export const LONDON_TIMEZONE = 'Europe/London';

export const UNITS = {
  BOOKING_DATETIME: {
    value: 'BOOKING_DATETIME',
  },
  CHANGED: {
    value: 'CHANGED',
  },
  DATETIME: {
    value: 'DATETIME',
  },
  DISTANCE: {
    value: 'DISTANCE',
    unit: 'm',
  },
  WEIGHT: {
    value: 'WEIGHT',
    unit: 'kg',
  },
  CURRENCY: {
    value: 'CURRENCY',
    unit: '£',
  },
  SHORT_DATE: {
    value: 'SHORT_DATE',
    unit: 'days',
  },
  SHORT_DATE_ALT: {
    value: 'SHORT_DATE_ALT',
    unit: 'days',
  },
};

export const GENDERS = {
  MALE: {
    value: 'Male',
    unit: 'M',
  },
  FEMALE: {
    value: 'Female',
    unit: 'F',
  },
};

export const TASK_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'inProgress',
  ISSUED: 'issued',
  COMPLETE: 'complete',
  RELISTED: 'Relisted',
  UPDATED: 'Updated',
};

export const TASK_STATUS_BY_INDEX = {
  0: TASK_STATUS.NEW,
  1: TASK_STATUS.IN_PROGRESS,
  2: TASK_STATUS.ISSUED,
  3: TASK_STATUS.COMPLETE,
};

export const TASK_OUTCOME = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NO_SHOW: 'noShow',
  MISSED: 'missed',
  INSUFFICIENT_RESOURCES: 'insufficientResources',
  TARGET_WITHDRAWN: 'targetWithdrawn',
};

export const TARGETER_GROUP = '/bf-intel-targeters';

export const MOVEMENT_DESCRIPTION = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
};

export const MOVEMENT_MODES = {
  TOURIST: 'RORO_TOURIST',
  UNACCOMPANIED_FREIGHT: 'RORO_UNACCOMPANIED_FREIGHT',
  ACCOMPANIED_FREIGHT: 'RORO_ACCOMPANIED_FREIGHT',
  AIR_PASSENGER: 'AIR_PASSENGER',
};

export const MOVEMENT_ROLE = {
  AIR_CREW: 'CREW',
  DRIVER: 'DRIVER',
  PASSENGER: 'PASSENGER',
};

export const MODE = {
  RORO: 'RORO',
  AIRPAX: 'AIRPAX',
};

export const VIEW = {
  RORO: 'RORO',
  RORO_V2: 'RORO_V2',
  AIRPAX: 'AIRPAX',
};

export const ICON = {
  CAR: 'c-icon-car',
  INDIVIDUAL: 'c-icon-person',
  GROUP: 'c-icon-group',
  TRAILER: 'c-icon-trailer',
  HGV: 'c-icon-hgv',
  VAN: 'c-icon-van',
  NONE: '',
};

export const ICON_MAPPING = {
  RORO_ACCOMPANIED_FREIGHT: {
    'vehicle-with-trailer': ICON.HGV,
    'vehicle-only': ICON.VAN,
    'trailer-only': ICON.TRAILER,
    'without-vehicle-and-trailer': ICON.NONE,
  },
  RORO_UNACCOMPANIED_FREIGHT: {
    'trailer-only': ICON.TRAILER,
    'without-trailer': ICON.NONE,
  },
  RORO_TOURIST: {
    vehicle: ICON.CAR,
    individual: ICON.INDIVIDUAL,
    group: ICON.GROUP,
  },
};

export const DESCRIPTION_MAPPING = {
  vehicle: 'Vehicle',
  individual: 'Single passenger',
  group: 'Group',
};

export const STRINGS = {
  DEFAULT_BOOKING_STRING_PREFIX: 'Booked',
  UNKNOWN_TEXT: 'Unknown',
  A_TITLE_CASE_TEXT: 'A ',
  A_SMALL_TEXT: 'a ',
  AN_TITLE_CASE_TEXT: 'An ',
  AN_SMALL_TEXT: 'an ',
  AFTER_TRAVEL_TEXT: 'after travel',
  AGO_TEXT: 'ago',
  ARRIVAL_TEXT: 'Arrival',
  BEFORE_TRAVEL_TEXT: 'before travel',
  CURRENTLY_UNAVAILABLE_TEXT: 'Currently unavailable',
  DAYJS_FUTURE: 'before travel',
  DAYJS_FUTURE_AIRPAX_REPLACE: 'before departure',
  DAYJS_PAST: 'ago',
  NO_TEXT: 'No',
  NONE_TEXT: 'None',
  LATER_TEXT: 'later',
  YES_TEXT: 'Yes',
  TASK_MANAGEMENT_INLINE_HEADERS: {
    AIRPAX: 'AirPax',
    RORO_V1: 'RoRo',
    RORO_V2: 'RoRo V2',
  },
  TASK_LINK_HEADERS: {
    AIRPAX: 'Airpax tasks',
    RORO_V1: 'RoRo tasks',
    RORO_V2: 'RoRo V2 tasks',
  },
};

export const FONT_CLASSES = {
  0: 'font__bold',
  1: 'font__light',
};

export const OPERATION = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
};

export const UNKNOWN_TIME_DATA = { h: null, m: null, s: null };

export const CO_TRAVELLERS_TABLE_HEADERS = [
  'Traveller',
  'Age',
  'Document',
];

export const WARNING_CODES_MAPPING = {
  VIOL: 'Violence',
  FIRE: 'Firearms',
  WEAP: 'Weapons',
  CTGN: 'Contagion',
  SEH: 'Self Harm',
};

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
  AIRPAX_TARGET_INFORMATION_SHEET: 'cerberus-airpax-target-information-sheet',
};

export const FORM_MESSAGES = {
  ON_CANCELLATION: 'Are you sure you want to cancel?',
};

export const COMPONENT_TYPES = {
  SELECT: 'select',
  MULTIAUTOCOMPLETE: 'multiautocomplete',
  CHECKBOXES: 'checkboxes',
  RADIOS: 'radios',
  TEXT_INPUT: 'text',
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

export const LOCAL_STORAGE_KEYS = {
  AIRPAX_FILTERS: 'airpax-filters',
  PNR_USER_SESSION_ID: 'pnr-user-session',
  RORO_FILTERS: 'roro-filters',
  TASK_STATUS: 'task-status',
  VIEW: 'VIEW',
};

export const RORO_FILTERS = [
  {
    filterName: 'movementModes',
    filterType: 'checkbox',
    filterClassPrefix: 'checkboxes',
    filterLabel: 'Mode',
    filterOptions: [
      {
        optionName: 'RORO_UNACCOMPANIED_FREIGHT',
        optionLabel: 'RoRo unaccompanied freight',
        checked: false,
      },
      {
        optionName: 'RORO_ACCOMPANIED_FREIGHT',
        optionLabel: 'RoRo accompanied freight',
        checked: false,
      },
      {
        optionName: 'RORO_TOURIST',
        optionLabel: 'RoRo Tourist',
        checked: false,
      },
    ],
  },
  {
    filterName: 'hasSelectors',
    filterType: 'radio',
    filterClassPrefix: 'radios',
    filterLabel: 'Selectors',
    filterOptions: [
      {
        optionName: 'true',
        optionLabel: 'Has selector',
        checked: false,
      },
      {
        optionName: 'false',
        optionLabel: 'Has no selector',
        checked: false,
      },
      {
        optionName: 'any',
        optionLabel: 'Both',
        checked: true,
      },
    ],
  },
];

// RoRo V1
export const DEFAULT_APPLIED_RORO_FILTER_STATE = {
  movementModes: [],
  hasSelectors: 'both',
  mode: [],
};

// RoRo V1
export const DEFAULT_MOVEMENT_RORO_MODES = [
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.UNACCOMPANIED_FREIGHT],
    hasSelectors: null,
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT],
    hasSelectors: null,
  },
  {
    taskStatuses: [],
    movementModes: [MOVEMENT_MODES.TOURIST],
    hasSelectors: null,
  },
];

// RoRo V1
export const DEFAULT_RORO_HAS_SELECTORS = [
  {
    taskStatuses: [],
    movementModes: [],
    hasSelectors: true,
  },
  {
    taskStatuses: [],
    movementModes: [],
    hasSelectors: false,
  },
  {
    taskStatuses: [],
    movementModes: [],
    hasSelectors: null,
  },
];

export const TAB_STATUS_MAPPING = {
  new: 'NEW',
  inProgress: 'IN_PROGRESS',
  issued: 'ISSUED',
  complete: 'COMPLETE',
};

export const TASK_STATUS_MAPPING = {
  new: 'new',
  inProgress: 'in progress',
  issued: 'issued',
  complete: 'complete',
};

export const FORM_ACTIONS = {
  CANCEL: 'cancel',
  NEXT: 'next',
};

export const PATHS = {
  AIRPAX: '/airpax/tasks',
  RORO: '/tasks',
  RORO_V2: '/roro/tasks',
  ISSUE_TARGET: '/issue-target',
  TASK_LISTS() {
    return [
      this.RORO,
      this.RORO_V2,
      this.AIRPAX,
    ];
  },
};

export const STATUS_CODES = {
  FORBIDDEN: 403,
};

export const UTC_DATE_REGEXS = [
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/,
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/,
];
