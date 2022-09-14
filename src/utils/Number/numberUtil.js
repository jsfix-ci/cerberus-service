const isNotNumber = (number) => {
  if (!number && number !== 0) {
    return true;
  }
  return isNaN(number);
};

const resetToZero = (value) => {
  if (!value || value < 0) {
    return 0;
  }
  return value;
};

// This will add a comma to long numbers e.g. 10000 would be returned as 10,000.
const formatWithCommas = (value) => {
  if (!value || isNotNumber(value)) {
    return value;
  }
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const isGreaterThanZero = (value) => {
  if (isNotNumber(value)) {
    return false;
  }
  return parseInt(value, 10) > 0;
};

const hasZeroCount = (content) => {
  return content === '0' || content === 0;
};

const NumberUtil = {
  checkZeroCount: hasZeroCount,
  greaterThanZero: isGreaterThanZero,
  notANumber: isNotNumber,
  withComma: formatWithCommas,
  resetZero: resetToZero,
};

export default NumberUtil;

export { formatWithCommas, hasZeroCount, isGreaterThanZero, isNotNumber, resetToZero };
