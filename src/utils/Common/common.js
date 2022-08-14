import lookup from 'country-code-lookup';
import { LOCAL_STORAGE_KEYS, TASK_LIST_PATHS, STRINGS, VIEW } from '../constants';

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

const Common = {
  iso3Code: convertToIso3Code,
  setViewAndGet: determineViewByPath, // TODO: Write test
};

export default Common;

export { convertToIso3Code };
