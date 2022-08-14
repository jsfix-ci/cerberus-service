import { STRINGS } from '../constants';

const getTrailerRegistration = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.registration || STRINGS.UNKNOWN_TEXT;
};

const getTrailer = (targetTask) => {
  return targetTask?.movement?.trailer || undefined;
};

const TrailerUtil = {
  get: getTrailer,
  trailerReg: getTrailerRegistration,
};

export default TrailerUtil;
