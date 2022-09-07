import lookup from 'country-code-lookup';

import { LOCAL_STORAGE_KEYS, PATHS, STRINGS, TASK_STATUS_BY_INDEX } from '../constants';
import { getLocalStoredItemByKeyValue } from '../Storage/storageUtil';

export const VIEW = {
  RORO: 'RORO',
  AIRPAX: 'AIRPAX',
  RORO_V2: 'RORO_V2',
  NONE: 'RORO',
};

const getTaskListPathFromURL = (path) => {
  const regex = /(.*)\/.*/;
  return path?.toString()?.replace(regex, '$1') || path;
};

const setTaskStatus = (taskManagementTabIndex) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.TASK_STATUS, TASK_STATUS_BY_INDEX[taskManagementTabIndex]);
};

const getViewByPath = (path) => {
  switch (path) {
    case PATHS.RORO: {
      return VIEW.RORO;
    }
    case PATHS.AIRPAX: {
      return VIEW.AIRPAX;
    }
    case PATHS.RORO_V2: {
      return VIEW.RORO_V2;
    }
    default: {
      return VIEW.RORO;
    }
  }
};

const containsAssignee = (filterKey) => {
  const payload = getLocalStoredItemByKeyValue(filterKey);
  return !!payload?.assignedToMe?.length;
};

// This is also known as enrichment counts
const getMovementStats = (entity) => {
  return entity?.movementStats || undefined;
};

const convertToIso3Code = (iso2Code) => {
  if (!iso2Code) {
    return STRINGS.UNKNOWN_TEXT;
  }
  if (!lookup.byIso(iso2Code)) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return lookup.byIso(iso2Code).iso3;
};

const CommonUtil = {
  taskListPath: getTaskListPathFromURL,
  iso3Code: convertToIso3Code,
  movementStats: getMovementStats,
  hasAssignee: containsAssignee,
  viewByPath: getViewByPath,
  setStatus: setTaskStatus,
};

export default CommonUtil;

export {
  convertToIso3Code,
  getMovementStats,
  getTaskListPathFromURL,
  getViewByPath,
  containsAssignee,
  setTaskStatus,
};
