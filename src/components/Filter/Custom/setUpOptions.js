/**
 * Within the customOptions node, the component id has to be paired up with the options for that component.
 * e.g.
 * const customOptions = {
 *   component_id: [
 *   {value: 'alpha', label: 'Alpha'},
 *   {value: 'bravo', label: 'Bravo'}
 *   ]
 * };
 *
 */
const setUpOptions = (component, customOptions) => {
  if (component?.useCustomOptions) {
    return {
      options: customOptions[component.id],
    };
  }
  return (component?.data?.options && { options: component.data.options });
};

export default setUpOptions;
