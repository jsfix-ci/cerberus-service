const setupConditions = (component) => {
  let conditions = component?.show_when?.type ? component.show_when.conditions : component.show_when;
  return Array.isArray(conditions) ? conditions : [conditions];
};

export default setupConditions;
