const getCountForOption = (fieldId, value, taskStatus, modeCounts, selectorCounts) => {
  if (fieldId === 'selectors') {
    return selectorCounts?.find((f) => {
      return f.filterParams[fieldId] === value;
    })?.statusCounts[taskStatus];
  }
  if (fieldId === 'mode') {
    return modeCounts?.find((f) => {
      return f.filterParams.movementModes[0] === value;
    })?.statusCounts[taskStatus];
  }
  return 0;
};

const setupOptions = (component, taskStatus, modeCounts, selectorCounts) => {
  return component.data.options.map((opt) => {
    let count = getCountForOption(component.fieldId, opt.value, taskStatus, modeCounts, selectorCounts);
    count = count === undefined ? 0 : count;
    const originalLabel = opt.originalLabel || opt.label;
    const label = count === null ? originalLabel : `${originalLabel} (${count})`;
    return {
      ...opt,
      count,
      originalLabel,
      label,
    };
  });
};

const setupComponentOptions = (component, taskStatus, modeCounts, selectorCounts) => {
  if (component.data?.options && component.dynamicOptions) {
    component.data.options = setupOptions(component, taskStatus, modeCounts, selectorCounts);
  }
  return component;
};

const setupFilterCounts = (filter, taskStatus, modeCounts, selectorCounts) => {
  filter.pages = filter.pages.map((page) => {
    return {
      ...page,
      components: page.components.map((component) => {
        return setupComponentOptions(component, taskStatus, modeCounts, selectorCounts);
      }),
    };
  });
  return filter;
};

export default setupFilterCounts;
