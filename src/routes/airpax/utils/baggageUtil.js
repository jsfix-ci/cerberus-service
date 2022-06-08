import * as pluralise from 'pluralise';
import { UNKNOWN_TEXT } from '../../../constants';

const getBaggageWeight = (baggage) => {
  if (!baggage?.weight) {
    return UNKNOWN_TEXT;
  }
  return baggage.weight;
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

const getCheckedBags = (baggage, taskDetails = false) => {
  if ((!baggage || !baggage?.numberOfCheckedBags) && baggage?.numberOfCheckedBags !== 0) {
    return UNKNOWN_TEXT;
  }
  return pluralise.withCount(
    baggage.numberOfCheckedBags,
    '% checked bag',
    '% checked bags',
    (taskDetails ? 'None' : 'No checked bags'),
  );
};

const getNumberOfCheckedBags = (baggage) => {
  if ((!baggage || !baggage?.numberOfCheckedBags) && baggage?.numberOfCheckedBags !== 0) {
    return UNKNOWN_TEXT;
  }
  return baggage.numberOfCheckedBags;
};

const toFormattedCheckedBagsCount = (baggage) => {
  if ((!baggage || !baggage?.numberOfCheckedBags) && baggage?.numberOfCheckedBags !== 0) {
    return UNKNOWN_TEXT;
  }
  return pluralise.withCount(
    baggage.numberOfCheckedBags,
    '% bag',
    '% bags',
    'None',
  );
};

const BaggageUtil = {
  get: getBaggage,
  weight: getBaggageWeight,
  checked: getCheckedBags,
  checkedCount: getNumberOfCheckedBags,
  formatCheckedCount: toFormattedCheckedBagsCount,
};

export default BaggageUtil;

export { getBaggageWeight, getBaggage, getCheckedBags, getNumberOfCheckedBags };
