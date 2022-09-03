import meetsCondition from './meetsCondition';
import setupConditions from './setupConditions';

/**
 * Evaluates all condition(s) of a component.
 * @param {object} component The component to consider.
 * @param {object} data The top-level form data.
 * @returns Boolean true if all conditions are met; false otherwise.
 */
const meetsAllConditions = (component, data) => {
  const conditions = setupConditions(component);
  if (conditions) {
    const arr = Array.isArray(conditions) ? conditions : [conditions];
    return arr.every((condition) => {
      return meetsCondition(condition, data);
    });
  }
  return true;
};

export default meetsAllConditions;
