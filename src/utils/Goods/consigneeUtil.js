const getConsignee = (targetTask) => {
  return targetTask?.movement?.consignee || undefined;
};

// TODO: Tests
const ConsigneeUtil = {
  get: getConsignee,
};

export default ConsigneeUtil;

export {
  getConsignee,
};
