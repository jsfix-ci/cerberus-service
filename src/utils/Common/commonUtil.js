import lookup from 'country-code-lookup';

import { STRINGS } from '../constants';
import { getLocalStoredItemByKeyValue } from '../Storage/storageUtil';

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
};

export default CommonUtil;

export {
  convertToIso3Code,
  getMovementStats,
  hasAssignee,
};
