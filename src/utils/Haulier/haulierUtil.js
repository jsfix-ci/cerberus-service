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
  address: getAddress, // TODO
  get: getHaulier,
  mobile: getHaulierMobile, // TODO
  name: getHaulierName,
  telephone: getHaulierTelephone, // TODO
};

export default HaulierUtil;
