import { STRINGS } from '../constants';

const HAZARDOUS_MAPPING = {
  true: STRINGS.YES_TEXT,
  false: STRINGS.NO_TEXT,
};

// TODO: Are we receiving this data?
const getGoodsWeight = (goods) => {
  if (!goods) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return goods?.weight || STRINGS.UNKNOWN_TEXT;
};

const getHazardous = (goods) => {
  return HAZARDOUS_MAPPING[!!goods?.hazardous];
};

const getDescription = (goods) => {
  if (!goods) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return goods?.description || STRINGS.UNKNOWN_TEXT;
};

const getGoods = (targetTask) => {
  return targetTask?.movement?.goods || undefined;
};

const GoodsUtil = {
  get: getGoods,
  description: getDescription,
  hazardous: getHazardous,
  weight: getGoodsWeight, // TODO
};

export default GoodsUtil;
