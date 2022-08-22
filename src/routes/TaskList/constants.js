import { LOCAL_STORAGE_KEYS,
  MODE,
  MOVEMENT_MODES,
  STRINGS,
  TASK_LIST_PATHS } from '../../utils/constants';
import config from '../../utils/config';

const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const DEFAULTS = {
  AIRPAX: {
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
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'NOT_PRESENT',
          ruleIds: [],
          searchText: '',
          assignees: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
        },
      ],
    },
    headers: {
      title: STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.AIRPAX,
      links: [
        {
          url: TASK_LIST_PATHS.RORO,
          label: STRINGS.TASK_LINK_HEADERS.RORO_V1,
          show: true,
        },
        {
          url: TASK_LIST_PATHS.RORO_V2,
          label: STRINGS.TASK_LINK_HEADERS.RORO_V2,
          show: config.roroV2ViewEnabled,
        },
      ],
    },
    redirectPath: TASK_LIST_PATHS.AIRPAX,
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
  RORO_V2: {
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
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.TOURIST],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
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
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'NOT_PRESENT',
          ruleIds: [],
          searchText: '',
          assignees: [],
        },
        {
          taskStatuses: [],
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST],
          selectors: 'ANY',
          ruleIds: [],
          searchText: '',
          assignees: [],
        },
      ],
    },
    headers: {
      title: STRINGS.TASK_MANAGEMENT_INLINE_HEADERS.RORO_V2,
      links: [
        {
          url: TASK_LIST_PATHS.RORO,
          label: STRINGS.TASK_LINK_HEADERS.RORO_V1,
          show: true,
        },
        {
          url: TASK_LIST_PATHS.AIRPAX,
          label: STRINGS.TASK_LINK_HEADERS.AIRPAX,
          show: config.copTargetingApiEnabled,
        },
      ],
    },
    redirectPath: TASK_LIST_PATHS.RORO_V2,
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
