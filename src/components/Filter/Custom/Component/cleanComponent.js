const ATTRS_TO_CLEAN = ['dynamicOptions', 'data'];

const cleanComponent = (component) => {
  ATTRS_TO_CLEAN.forEach((attr) => {
    delete component[attr];
  });
  return component;
};

export default cleanComponent;
