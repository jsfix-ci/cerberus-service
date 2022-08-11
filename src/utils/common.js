import lookup from 'country-code-lookup';
import { UNKNOWN_TEXT } from '../constants';

const convertToIso3Code = (iso2Code) => {
  if (!iso2Code) {
    return UNKNOWN_TEXT;
  }
  if (!lookup.byIso(iso2Code)) {
    return UNKNOWN_TEXT;
  }
  return lookup.byIso(iso2Code).iso3;
};

const Common = {
  iso3Code: convertToIso3Code,
};

export default Common;

export { convertToIso3Code };
