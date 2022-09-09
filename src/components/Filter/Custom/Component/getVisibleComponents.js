import showComponent from './showComponent';

const getVisibleComponents = (components, data) => {
  const componentsToDisplay = [];
  components.forEach((component) => {
    if (showComponent(component, data)) {
      componentsToDisplay.push(component);
    }
  });
  return componentsToDisplay;
};

export default getVisibleComponents;
