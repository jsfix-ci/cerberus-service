import { STRINGS } from '../constants';

const getHazardous = (goods) => {
  if (!goods) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return goods?.hazardous;
};

const getDescription = (goods) => {
  if (!goods) {
    return STRINGS.UNKNOWN_TEXT;
  }
  return goods?.description;
};

const getGoods = (targetTask) => {
  return targetTask?.movement?.goods;
};

// TODO: Write test
const GoodsUtil = {
  get: getGoods,
  description: getDescription,
  hazardous: getHazardous,
};

export default GoodsUtil;
