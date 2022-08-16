import lookup from 'country-code-lookup';

import { LOCAL_STORAGE_KEYS, TASK_LIST_PATHS, STRINGS, VIEW } from '../constants';

// This is also known as enrichment counts
const getMovementStats = (entity) => {
  return entity?.movementStats || undefined;
};

const setTaskStatusByView = (view, taskStatus) => {
  if (view === VIEW.RORO) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS, taskStatus);
  }
  if (view === VIEW.AIRPAX) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS, taskStatus);
  }
};

const removeFiltersByView = (view) => {
  if (view === VIEW.RORO) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RORO_FILTERS);
  }
  if (view === VIEW.AIRPAX) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS);
  }
};

const removeTaskStatusByView = (view) => {
  if (view === VIEW.RORO) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS);
  }
  if (view === VIEW.AIRPAX) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS);
  }
};

const getTaskStatusKeyByView = (view) => {
  switch (view) {
    case VIEW.RORO: {
      return LOCAL_STORAGE_KEYS.RORO_TASK_STATUS;
    }
    case VIEW.AIRPAX: {
      return LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS;
    }
    default: {
      return undefined;
    }
  }
};

const getFilterKeyByView = (view) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return LOCAL_STORAGE_KEYS.AIRPAX_FILTERS;
    }
    case VIEW.RORO: {
      return LOCAL_STORAGE_KEYS.RORO_FILTERS;
    }
    default: {
      return undefined;
    }
  }
};

const getViewDetailsURL = (view, targetTask) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return `${TASK_LIST_PATHS.AIRPAX[0]}/${targetTask.id}`;
    }
    case VIEW.RORO: {
      return `${TASK_LIST_PATHS.RORO_V2[0]}/${targetTask.id}`;
    }
    default: {
      return undefined;
    }
  }
};

const getSourceRedirectURL = (view, businessKey) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return `${TASK_LIST_PATHS.AIRPAX[0]}/${businessKey}`;
    }
    case VIEW.RORO: {
      return `${TASK_LIST_PATHS.RORO_V2[0]}/${businessKey}`;
    }
    default: {
      return undefined;
    }
  }
};

const getTaskListURL = (view, businessKey) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return `${TASK_LIST_PATHS.AIRPAX[0]}/${businessKey}`;
    }
    case VIEW.RORO: {
      return `${TASK_LIST_PATHS.RORO_V2[0]}/${businessKey}`;
    }
    default: {
      return undefined;
    }
  }
};

const getUnclaimRedirectURL = (view) => {
  switch (view) {
    case VIEW.AIRPAX: {
      return TASK_LIST_PATHS.AIRPAX[0];
    }
    case VIEW.RORO: {
      return TASK_LIST_PATHS.RORO_V2[0];
    }
    default: {
      return undefined;
    }
  }
};

const determineViewByPath = (location) => {
  if (!location) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.NONE);
    return VIEW.NONE;
  }
  if (!location.startsWith(TASK_LIST_PATHS.AIRPAX[0])
    && !location.startsWith(TASK_LIST_PATHS.RORO[0])
    && !location.startsWith(TASK_LIST_PATHS.RORO_V2[0])) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.NONE);
    return VIEW.NONE;
  }
  if (location.startsWith(TASK_LIST_PATHS.AIRPAX[0])) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.AIRPAX);
    return VIEW.AIRPAX;
  }
  if (location.startsWith(TASK_LIST_PATHS.RORO[0])
    || location.startsWith(TASK_LIST_PATHS.RORO_V2[0])) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.RORO);
    return VIEW.RORO;
  }
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

// TODO: Write test
const CommonUtil = {
  iso3Code: convertToIso3Code,
  unclaimRedirect: getUnclaimRedirectURL,
  filterKeyByView: getFilterKeyByView,
  movementStats: getMovementStats,
  removeTaskStatusByView,
  removeFiltersByView,
  setTaskStatusByView,
  setViewAndGet: determineViewByPath,
  sourceRedirect: getSourceRedirectURL,
  taskListURL: getTaskListURL,
  taskStatusKeyByView: getTaskStatusKeyByView,
  viewDetailsURL: getViewDetailsURL,
};

export default CommonUtil;

export { convertToIso3Code,
  determineViewByPath,
  getUnclaimRedirectURL,
  getTaskListURL,
  getSourceRedirectURL,
  getViewDetailsURL,
  getFilterKeyByView,
  getTaskStatusKeyByView,
  setTaskStatusByView,
  removeFiltersByView,
  removeTaskStatusByView,
  getMovementStats };
