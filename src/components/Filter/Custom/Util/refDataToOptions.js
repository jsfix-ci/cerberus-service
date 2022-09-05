const getValueAndLabel = (opt, itemStructure) => {
  let value = opt.value || opt.id;
  let label = opt.label || opt.name;
  if (itemStructure) {
    value = opt[itemStructure.value] || value;
    label = opt[itemStructure.label] || label;
  }
  return { value: value?.toString(), label };
};

const refDataToOptions = (component, data) => {
  if (data && typeof component?.item === 'object') {
    const { data: _data } = data;
    const itemStructure = component?.item;
    return _data?.map((opt) => {
      return {
        ...opt,
        ...getValueAndLabel(opt, itemStructure),
      };
    });
  }
  return [];
};

export default refDataToOptions;
