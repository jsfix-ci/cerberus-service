import { STRINGS } from '../constants';

const getTrailerLength = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.length || STRINGS.UNKNOWN_TEXT;
};

const getTrailerHeight = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.height || STRINGS.UNKNOWN_TEXT;
};

const getLoadedStatus = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.loadStatus || STRINGS.UNKNOWN_TEXT;
};

const getTrailerNationality = (trailer) => {
  if (!trailer) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return trailer?.nationality || STRINGS.UNKNOWN_TEXT;
};

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

const TrailerUtil = {
  get: getTrailer,
  height: getTrailerHeight,
  length: getTrailerLength,
  loadStatus: getLoadedStatus,
  nationality: getTrailerNationality,
  registration: getTrailerRegistration,
  type: getTrailerType,
};

export default TrailerUtil;

export {
  getTrailer,
  getTrailerHeight,
  getTrailerLength,
  getLoadedStatus,
  getTrailerNationality,
  getTrailerRegistration,
  getTrailerType,
};
