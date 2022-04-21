import { formatField } from '../../../../utils/formatField';

const getBaggageWeight = (baggage) => {
  return formatField('WEIGHT', baggage.weight);
};

const getBaggage = (targetTask) => {
  return targetTask.movement.baggage;
};

const hasBaggage = (targetTask) => {
  return !!targetTask.movement.baggage;
};

const getCheckedBags = (baggage) => {
  let checkedBags;
  if (baggage.numberOfCheckedBags === 0) {
    checkedBags = 'No checked bags';
  }
  if (baggage.numberOfCheckedBags >= 1) {
    checkedBags = `${baggage.numberOfCheckedBags} checked bag(s)`;
  }
  return checkedBags;
};

const BaggageUtil = {
  get: getBaggage,
  has: hasBaggage,
  weight: getBaggageWeight,
  checked: getCheckedBags,
};

export default BaggageUtil;

export { getBaggageWeight, getBaggage, hasBaggage, getCheckedBags };
