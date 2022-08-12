const numberWithCommas = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const isNotNumber = (number) => {
  if (!number && number !== 0) {
    return true;
  }
  return isNaN(number);
};

const hasZeroCount = (content) => {
  return content === '0' || content === 0;
};

const NumberUtil = {
  checkZeroCount: hasZeroCount,
  notANumber: isNotNumber,
  withComma: numberWithCommas,
};

export default NumberUtil;

export { hasZeroCount, isNotNumber, numberWithCommas };
