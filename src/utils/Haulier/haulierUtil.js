import { STRINGS } from '../constants';

const getHaulierMobile = (haulier) => {
  if (!haulier) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return haulier?.contacts?.mobile?.value || STRINGS.UNKNOWN_TEXT;
};

const getHaulierTelephone = (haulier) => {
  if (!haulier) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return haulier?.contacts?.phone?.value || STRINGS.UNKNOWN_TEXT;
};

const getAddress = (haulier) => {
  if (!haulier) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return haulier?.address || undefined;
};

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
  address: getAddress,
  get: getHaulier,
  mobile: getHaulierMobile,
  name: getHaulierName,
  telephone: getHaulierTelephone,
};

export default HaulierUtil;

export {
  getAddress,
  getHaulier,
  getHaulierMobile,
  getHaulierName,
  getHaulierTelephone,
};
