import { STRINGS } from '../constants';

const getTrailerType = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.type || STRINGS.UNKNOWN_TEXT;
};

const getTrailerRegistration = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.registration || STRINGS.UNKNOWN_TEXT;
};

const getTrailer = (targetTask) => {
  return targetTask?.movement?.trailer || undefined;
};

// TODO: Write tests
const TrailerUtil = {
  get: getTrailer,
  trailerReg: getTrailerRegistration,
  type: getTrailerType,
};

export default TrailerUtil;
