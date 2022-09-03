import _ from 'lodash';

const getFieldPath = (path) => {
  if (!path) {
    return undefined;
  }
  if (path.startsWith('./')) {
    return path.replaceAll('./', '');
  }
  return path;
};

const getComparisonValue = (condition) => {
  if (['in', 'nin'].includes(condition.op)) {
    return condition.values;
  }
  return condition.value;
};

const meetsCondition = (condition, data) => {
  if (condition && typeof condition === 'object') {
    const path = getFieldPath(condition.field);
    const value = _.get(data, path);
    const compare = getComparisonValue(condition);
    switch (condition.op) {
      case '=':
      case 'eq': {
        return compare === value;
      }
      case 'in': {
        if (Array.isArray(compare)) {
          return compare.includes(value);
        }
        // If it's not an array, nothing can be IN it, so it must fail the condition.
        return false;
      }
      case 'nin': {
        if (Array.isArray(compare)) {
          return compare.includes(value) === false;
        }
        // If it's not an array, nothing can be IN it, so it must meet the condition.
        return true;
      }
      case '!=':
      case '<>':
      case 'ne':
      case 'neq': {
        return compare !== value;
      }
      case 'contains': {
        return value?.toString().toLowerCase().includes(compare);
        // If no value is provided, the field cannot contain it, so it must fail the condition.
      }
      default: {
        return false;
      }
    }
  }
  return true;
};

export default meetsCondition;
