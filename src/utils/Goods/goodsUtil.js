import { STRINGS } from '../constants';

const getHazardous = (goods) => {
  return !!goods?.hazardous;
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
};

export default GoodsUtil;
