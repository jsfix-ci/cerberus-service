import _ from 'lodash';

// Extract components which are not in view and remove their unique fieldId entries from the payload
const cleanPayload = (visibleComponents, components, data) => {
  if (!visibleComponents || !components) {
    return data;
  }
  const nonVisibleComponents = _.difference(components, visibleComponents).filter((c) => c);
  const payload = _.cloneDeep(data);
  nonVisibleComponents.forEach((component) => delete payload[component.fieldId]);
  return payload;
};

export default cleanPayload;
