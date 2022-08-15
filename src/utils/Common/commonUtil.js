import lookup from 'country-code-lookup';

import { LOCAL_STORAGE_KEYS, TASK_LIST_PATHS, STRINGS, VIEW } from '../constants';

// This is also known as enrichment counts
const getMovementStats = (entity) => {
  return entity?.movementStats || undefined;
};

const setTaskStatusByView = (view, taskStatus) => {
  if (view === VIEW.RORO || view === VIEW.RORO_V2) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS, taskStatus);
  }
  if (view === VIEW.AIRPAX) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS, taskStatus);
  }
};

const removeFiltersByView = (view) => {
  if (view === VIEW.RORO || view === VIEW.RORO_V2) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RORO_FILTERS);
  }
  if (view === VIEW.AIRPAX) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS);
  }
};

const removeTaskStatusByView = (view) => {
  if (view === VIEW.RORO || view === VIEW.RORO_V2) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.RORO_TASK_STATUS);
  }
  if (view === VIEW.AIRPAX) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS);
  }
};

const getTaskStatusKeyByView = (view) => {
  return (view !== VIEW.RORO && view !== VIEW.RORO_V2)
    ? LOCAL_STORAGE_KEYS.AIRPAX_TASK_STATUS : LOCAL_STORAGE_KEYS.RORO_TASK_STATUS;
};

const getFilterKeyByView = (view) => {
  return (view !== VIEW.RORO && view !== VIEW.RORO_V2)
    ? LOCAL_STORAGE_KEYS.AIRPAX_FILTERS : LOCAL_STORAGE_KEYS.RORO_FILTERS;
};

const getViewDetailsURL = (view, targetTask) => {
  if (view === VIEW.AIRPAX) {
    return `${TASK_LIST_PATHS.AIRPAX[0]}/${targetTask.id}`;
  }
  if (view === VIEW.RORO_V2) {
    return `${TASK_LIST_PATHS.RORO_V2[0]}/${targetTask.id}`;
  }
};

const getSourceRedirectURL = (view, businessKey) => {
  if (view === VIEW.AIRPAX) {
    return `${TASK_LIST_PATHS.AIRPAX[0]}/${businessKey}`;
  }
  if (view === VIEW.RORO_V2 || view === VIEW.RORO) {
    return `${TASK_LIST_PATHS.RORO_V2[0]}/${businessKey}`;
  }
};

const getTaskListURL = (view, businessKey) => {
  if (view === VIEW.AIRPAX) {
    return `${TASK_LIST_PATHS.AIRPAX[0]}/${businessKey}`;
  }
  if (view === VIEW.RORO_V2 || view === VIEW.RORO) {
    return `${TASK_LIST_PATHS.RORO_V2[0]}/${businessKey}`;
  }
};

const getUnclaimRedirectURL = (view) => {
  if (view === VIEW.AIRPAX) {
    console.log('Unclaim Redirect URL: ', TASK_LIST_PATHS.AIRPAX[0]);
    return TASK_LIST_PATHS.AIRPAX[0];
  }
  if (view === VIEW.RORO_V2 || view === VIEW.RORO) {
    console.log('Unclaim Redirect URL: ', TASK_LIST_PATHS.RORO_V2[0]);
    return TASK_LIST_PATHS.RORO_V2[0];
  }
};

// TODO: Revisit this and re-write
const determineViewByPath = (location) => {
  if (location.includes(TASK_LIST_PATHS.AIRPAX[0])
    && location.includes(TASK_LIST_PATHS.RORO[0])
    && !location.includes(TASK_LIST_PATHS.RORO_V2[0])) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.AIRPAX);
    return VIEW.AIRPAX;
  }
  if (location.includes(TASK_LIST_PATHS.RORO[0])
  && !location.includes(TASK_LIST_PATHS.AIRPAX[0])
  && !location.includes(TASK_LIST_PATHS.RORO_V2[0])) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.RORO);
    return VIEW.RORO;
  }
  if (location.includes(TASK_LIST_PATHS.RORO_V2[0])
    && !location.includes(TASK_LIST_PATHS.AIRPAX[0])
    && location.includes(TASK_LIST_PATHS.RORO[0])) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.RORO_V2);
    return VIEW.RORO_V2;
  }
  if (!TASK_LIST_PATHS.AIRPAX[0].includes(location)
    && !TASK_LIST_PATHS.RORO[0].includes(location) && !TASK_LIST_PATHS.RORO_V2[0].includes(location)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VIEW, VIEW.NONE);
    return VIEW.NONE;
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
  setViewAndGet: determineViewByPath,
  unclaimRedirect: getUnclaimRedirectURL,
  taskListURL: getTaskListURL,
  sourceRedirect: getSourceRedirectURL,
  viewDetailsURL: getViewDetailsURL,
  filterKeyByView: getFilterKeyByView,
  taskStatusKeyByView: getTaskStatusKeyByView,
  setTaskStatusByView,
  removeFiltersByView,
  removeTaskStatusByView,
  movementStats: getMovementStats,
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
