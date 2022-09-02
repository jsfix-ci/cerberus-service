import cleanComponent from './cleanComponent';
import setUpOptions from './setUpOptions';

const DEFAULT_WRAPPER_OPTIONS = ['id', 'label', 'required'];

const setUpValue = (component, data) => {
  return { value: data[component?.fieldId] || '' };
};

const setupComponent = (data, component, customOption, onChange) => {
  const wrapperOptions = {
    /**
     * Converts an object into an array map, performs filtering
     * and converts the resulting filtered array map back to an object
     */
    ...Object.fromEntries(Object.entries(component).filter(([key]) => DEFAULT_WRAPPER_OPTIONS.includes(key))),
  };
  let componentOptions = {
    ...wrapperOptions,
    ...Object.fromEntries(Object.entries(component).filter(([key]) => !DEFAULT_WRAPPER_OPTIONS.includes(key))),
    ...setUpValue(component, data),
    ...setUpOptions(component, customOption),
    onChange,
  };
  componentOptions = cleanComponent(componentOptions);
  return { wrapperOptions, componentOptions };
};

export default setupComponent;
