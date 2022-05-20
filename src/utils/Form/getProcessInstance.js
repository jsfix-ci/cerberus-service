/**
 * Inspect the processContext and return the current instance.
 * @param {object} processContext The current process context object.
 * @returns The process instance, if it exists, or an empty object if not.
 */
const getProcessInstance = (processContext) => {
  if (processContext && processContext.instance) {
    return processContext.instance;
  }
  return {};
};

export default getProcessInstance;
