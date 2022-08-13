import * as pluralise from 'pluralise';
import { STRINGS } from '../constants';
import { formatField } from '../FieldFormat/fieldFormatterUtil';

const getBaggageWeight = (baggage) => {
  if (!baggage?.weight) {
    return STRINGS.UNKNOWN_TEXT;
  }
  if (baggage.weight.endsWith('kg')) {
    return baggage.weight;
  }
  return formatField('WEIGHT', baggage.weight);
};

const hasBaggage = (targetTask) => {
  return !!targetTask?.movement?.baggage;
};

const getBaggage = (targetTask) => {
  if (hasBaggage(targetTask)) {
    return targetTask.movement.baggage;
  }
  return null;
};

const hasTags = (targetTask) => {
  return targetTask?.tags && !!targetTask.tags.length > 0;
};

const getTags = (targetTask) => {
  if (hasTags(targetTask)) {
    return targetTask.tags.join(', ');
  }
  return STRINGS.UNKNOWN_TEXT;
};

const getCheckedBags = (baggage, taskDetails = false) => {
  if ((!baggage || !baggage?.numberOfCheckedBags) && baggage?.numberOfCheckedBags !== 0) {
    return STRINGS.UNKNOWN_TEXT;
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
    return STRINGS.UNKNOWN_TEXT;
  }
  return baggage.numberOfCheckedBags;
};

const toFormattedCheckedBagsCount = (baggage) => {
  if ((!baggage || !baggage?.numberOfCheckedBags) && baggage?.numberOfCheckedBags !== 0) {
    return STRINGS.UNKNOWN_TEXT;
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
  tags: getTags,
  weight: getBaggageWeight,
  checked: getCheckedBags,
  checkedCount: getNumberOfCheckedBags,
  formatCheckedCount: toFormattedCheckedBagsCount,
};

export default BaggageUtil;

export { getBaggageWeight, getBaggage, getCheckedBags, getNumberOfCheckedBags };
