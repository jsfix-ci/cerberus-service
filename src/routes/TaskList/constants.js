import { LOCAL_STORAGE_KEYS,
  MODE,
  MOVEMENT_MODES,
  STRINGS,
  PATHS } from '../../utils/constants';
import { VIEW } from '../../utils/Common/commonUtil';
import config from '../../utils/config';

const AIRPAX_MODE_PARAMS = {
  taskStatuses: [],
  movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
  selectors: 'ANY',
  ruleIds: [],
  searchText: '',
  assignees: [],
  journeyDirections: [],
  departureStatuses: [],
};

const RORO_MODE_PARAMS = {
  mode: [],
  selectors: 'ANY',
  ruleIds: [],
  searchText: '',
  assignees: [],
  assignedToMe: [],
  journeyDirections: [],
};

const JOURNEY_DIRECTIONS = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
  UNKNOWN: 'UNKNOWN',
};

const SELECTORS = {
  ANY: 'ANY',
  PRESENT: 'PRESENT',
  NOT_PRESENT: 'NOT_PRESENT',
};

const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const DEFAULTS = {
  [VIEW.AIRPAX]: {
    filters: {
      key: LOCAL_STORAGE_KEYS.AIRPAX_FILTERS,
      default: {
        movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
        mode: MOVEMENT_MODES.AIR_PASSENGER,
        selectors: 'ANY',
        rules: [],
        searchText: '',
        assignees: [],
        assignedToMe: [],
        journeyDirections: [],
        departureStatuses: [],
      },
      mode: MODE.AIRPAX,
      flightStatuses: [
        {
          ...AIRPAX_MODE_PARAMS,
          departureStatuses: ['CHECKED_IN', 'BOOKED_PASSENGER'],
        },
        {
          ...AIRPAX_MODE_PARAMS,
          departureStatuses: ['DEPARTURE_CONFIRMED'],
        },
        {
          ...AIRPAX_MODE_PARAMS,
          departureStatuses: ['ARRIVED'],
        },
      ],
      movementModes: [
        {
          ...AIRPAX_MODE_PARAMS,
        },
      ],
      selectors: [
        {
          ...AIRPAX_MODE_PARAMS,
          selectors: SELECTORS.PRESENT,
        },
        {
          ...AIRPAX_MODE_PARAMS,
          selectors: SELECTORS.NOT_PRESENT,
        },
        {
          ...AIRPAX_MODE_PARAMS,
        },
      ],
      directions: [
        {
          ...AIRPAX_MODE_PARAMS,
          journeyDirections: [JOURNEY_DIRECTIONS.INBOUND],
        },
        {
          ...AIRPAX_MODE_PARAMS,
          journeyDirections: [JOURNEY_DIRECTIONS.OUTBOUND],
        },
        {
          ...AIRPAX_MODE_PARAMS,
          journeyDirections: [JOURNEY_DIRECTIONS.UNKNOWN],
        },
      ],
    },
    headers: {
      title: STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.AIRPAX,
      links: [
        {
          url: PATHS.RORO,
          label: STRINGS.TASK_LINK_HEADERS.RORO_V1,
          show: true,
        },
        {
          url: PATHS.RORO_V2,
          label: STRINGS.TASK_LINK_HEADERS.RORO_V2,
          show: config.roroV2ViewEnabled,
        },
      ],
    },
    redirectPath: PATHS.AIRPAX,
    sortParams: [
      {
        field: 'WINDOW_OF_OPPORTUNITY',
        order: SORT_ORDER.ASC,
      },
      {
        field: 'BOOKING_LEAD_TIME',
        order: SORT_ORDER.ASC,
      },
    ],
  },
  [VIEW.RORO_V2]: {
    filters: {
      key: LOCAL_STORAGE_KEYS.RORO_FILTERS,
      default: {
        movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
        mode: [],
        selectors: 'ANY',
        ruleIds: [],
        searchText: '',
        assignees: [],
        assignedToMe: [],
        journeyDirections: [],
      },
      mode: MODE.RORO,
      movementModes: [
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.UNACCOMPANIED_FREIGHT],
        },
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT],
        },
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.TOURIST],
        },
      ],
      selectors: [
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: SELECTORS.PRESENT,
        },
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: SELECTORS.NOT_PRESENT,
        },
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
        },
      ],
      directions: [
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          journeyDirections: [JOURNEY_DIRECTIONS.INBOUND],
        },
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          journeyDirections: [JOURNEY_DIRECTIONS.OUTBOUND],
        },
        {
          ...RORO_MODE_PARAMS,
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          journeyDirections: [JOURNEY_DIRECTIONS.UNKNOWN],
        },
      ],
    },
    headers: {
      title: STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.RORO_V2,
      links: [
        {
          url: PATHS.RORO,
          label: STRINGS.TASK_LINK_HEADERS.RORO_V1,
          show: true,
        },
        {
          url: PATHS.AIRPAX,
          label: STRINGS.TASK_LINK_HEADERS.AIRPAX,
          show: config.copTargetingApiEnabled,
        },
      ],
    },
    redirectPath: PATHS.RORO_V2,
    sortParams: [
      {
        field: 'ARRIVAL_TIME',
        order: SORT_ORDER.ASC,
      },
      {
        field: 'THREAT_LEVEL',
        order: SORT_ORDER.DESC,
      },
    ],
  },
};

export default DEFAULTS;
