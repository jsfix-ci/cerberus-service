import lookup from 'country-code-lookup';

import { STRINGS, PATHS } from '../constants';
import { getLocalStoredItemByKeyValue } from '../Storage/storageUtil';

export const VIEW = {
  RORO: 'RORO',
  AIRPAX: 'AIRPAX',
  RORO_V2: 'RORO_V2',
  NONE: 'RORO',
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

const hasAssignee = (filterKey) => {
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
  iso3Code: convertToIso3Code,
  movementStats: getMovementStats,
  hasAssignee,
  viewByPath: getViewByPath,
};

export default CommonUtil;

export {
  convertToIso3Code,
  getMovementStats,
  getViewByPath,
  hasAssignee,
};
