import getComponent from './getComponent';

const setUpOptions = (component, customOptions) => {
  if (component.id === 'rules') {
    return {
      options: customOptions.rulesOptions,
    };
  }
  return (component?.data?.options && { options: component.data.options });
};

const setupComponent = (data, component, customOption, onChange) => {
  const wrapperOptions = {
    id: component?.id,
    label: component?.label,
    ...(component?.required && { required: component.required }),
  };
  const componentOptions = {
    ...wrapperOptions,
    fieldId: component?.fieldId,
    type: component?.type,
    ...(component?.multi && { multi: component.multi }),
    ...(component?.placeholder && { placeholder: component.placeholder }),
    ...(component?.item && { item: component.item }),
    value: data[component?.fieldId] || '',
    ...setUpOptions(component, customOption),
    onChange,
  };
  return getComponent(component, wrapperOptions, componentOptions);
};

export default setupComponent;
