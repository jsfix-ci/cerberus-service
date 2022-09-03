import showComponent from './showComponent';

const getVisibleComponent = (component, data) => {
  if (showComponent(component, data)) {
    return component;
  }
  return undefined;
};

export default getVisibleComponent;
