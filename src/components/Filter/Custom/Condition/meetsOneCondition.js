import meetsCondition from './meetsCondition';
import setupConditions from './setupConditions';

/**
 * Evaluates all condition(s) of a component.
 * @param {object} component The component to consider.
 * @param {object} data The top-level form data.
 * @returns Boolean true if at least one conditions is met; false otherwise.
 */
const meetsOneCondition = (component, data) => {
  const conditions = setupConditions(component);
  if (conditions) {
    const arr = Array.isArray(conditions) ? conditions : [conditions];
    return arr.some((condition) => {
      return meetsCondition(condition, data);
    });
  }
  return true;
};

export default meetsOneCondition;
