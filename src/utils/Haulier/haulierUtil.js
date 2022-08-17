import { STRINGS } from '../constants';

const getHaulierName = (haulier) => {
  if (!haulier) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return haulier?.name || STRINGS.UNKNOWN_TEXT;
};

const getHaulier = (targetTask) => {
  return targetTask?.movement?.haulier || undefined;
};

const HaulierUtil = {
  get: getHaulier,
  name: getHaulierName,
};

export default HaulierUtil;
