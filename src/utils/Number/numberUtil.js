const numberWithCommas = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const NumberUtil = {
  withComma: numberWithCommas,
};

export default NumberUtil;

export { numberWithCommas };
