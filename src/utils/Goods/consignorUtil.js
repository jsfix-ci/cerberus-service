const getConsignor = (targetTask) => {
  return targetTask?.movement?.consignor || undefined;
};

// TODO: Tests
const ConsignorUtil = {
  get: getConsignor,
};

export default ConsignorUtil;

export {
  getConsignor,
};
