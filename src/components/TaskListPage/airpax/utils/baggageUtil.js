import { UNKNOWN_TEXT } from '../../../../constants';
import { formatField } from '../../../../utils/formatField';

const getBaggageWeight = (baggage) => {
  if (!baggage) {
    return UNKNOWN_TEXT;
  }
  return formatField('WEIGHT', baggage.weight);
};

const hasBaggage = (targetTask) => {
  return !!targetTask.movement.baggage;
};

const getBaggage = (targetTask) => {
  if (hasBaggage(targetTask)) {
    return targetTask.movement.baggage;
  }
  return null;
};

const getCheckedBags = (baggage) => {
  let checkedBags;
  if (baggage.numberOfCheckedBags === 0) {
    checkedBags = 'No checked bags';
  }
  if (baggage.numberOfCheckedBags === 1) {
    checkedBags = `${baggage.numberOfCheckedBags} checked bag`;
  }
  if (baggage.numberOfCheckedBags > 1) {
    checkedBags = `${baggage.numberOfCheckedBags} checked bags`;
  }
  return checkedBags;
};

const BaggageUtil = {
  get: getBaggage,
  weight: getBaggageWeight,
  checked: getCheckedBags,
};

export default BaggageUtil;

export { getBaggageWeight, getBaggage, getCheckedBags };
