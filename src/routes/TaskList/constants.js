import { LOCAL_STORAGE_KEYS,
  MODE,
  MOVEMENT_MODES,
  STRINGS,
  PATHS } from '../../utils/constants';
import { VIEW } from '../../utils/Common/commonUtil';
import config from '../../utils/config';

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
      },
      mode: MODE.AIRPAX,
      movementModes: [
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
      ],
      selectors: [
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'PRESENT',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'NOT_PRESENT',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
      ],
      directions: [
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: ['INBOUND'],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: ['OUTBOUND'],
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
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.UNACCOMPANIED_FREIGHT],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.TOURIST],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
      ],
      selectors: [
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'PRESENT',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'NOT_PRESENT',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: [],
        },
      ],
      directions: [
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: ['INBOUND'],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
          journeyDirections: ['OUTBOUND'],
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
