/**
 * Get tasks list data.
 *
 * @param axiosClient An axios client for a network request.
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const getTaskList = async (axiosClient, payload) => {
  try {
    return await axiosClient.post('/targeting-tasks/pages', payload)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Get task data.
 *
 * @param axiosClient An axios client for a network request.
 * @param businessKey The business key for the task a.k.a. taskId
 * @returns {Promise<*>} A fulfilled promise.
 */
const getTaskData = async (axiosClient, businessKey) => {
  try {
    return await axiosClient.get(`/targeting-tasks/${businessKey}`)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Get rules (for use in autocomplete typeahead).
 *
 * @param axiosClient An axios client for a network request.
 * @returns {Promise<*>} A fulfilled promise.
 */
const getRulesOptions = async (axiosClient) => {
  try {
    return await axiosClient.get('/filters/rules')
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Get task counts.
 *
 * @param axiosClient An axios client for a network request.
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const getTaskCount = async (axiosClient, payload) => {
  try {
    return await axiosClient.post('/targeting-tasks/status-counts', [payload || {}])
      .then((response) => response.data[0].statusCounts);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Get filters & selector counts.
 *
 * @param axiosClient An axios client for a network request.
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const getFiltersAndSelectorsCount = async (axiosClient, payload) => {
  try {
    return await axiosClient.post('/targeting-tasks/status-counts', payload)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Fetch the target information sheet data.
 *
 * @param axiosClient An axios client for a network request.
 * @param businessKey The business key for the task a.k.a. taskId
 * @returns {Promise<*>} A fulfilled promise.
 */
const getInformationSheet = async (axiosClient, businessKey) => {
  try {
    return await axiosClient.get(`/targeting-tasks/${businessKey}/information-sheets`)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Save notes to a task.
 *
 * @param axiosClient An axios client for a network request.
 * @param businessKey The business key for the task a.k.a. taskId
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const saveTaskNote = async (axiosClient, businessKey, payload) => {
  try {
    return await axiosClient.post(`/targeting-tasks/${businessKey}/notes`, payload);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Submit the target information sheet form.
 *
 * @param axiosClient An axios client for a network request.
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const submitTargetInformationSheet = async (axiosClient, payload) => {
  try {
    return await axiosClient.post('/targets', payload);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Submits the task completion form.
 *
 * @param axiosClient An axios client for a network request.
 * @param businessKey The business key for the task a.k.a. taskId
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const completeTargetingTask = async (axiosClient, businessKey, payload) => {
  try {
    return await axiosClient.post(`/targeting-tasks/${businessKey}/completions`, payload);
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Submits the task dismissal form.
 *
 * @param axiosClient An axios client for a network request.
 * @param businessKey The business key for the task a.k.a. taskId
 * @param payload The request parameters.
 * @returns {Promise<*>} A fulfilled promise.
 */
const dismissTargetingTask = async (axiosClient, businessKey, payload) => {
  try {
    return await axiosClient.post(`/targeting-tasks/${businessKey}/dismissals`, payload);
  } catch (e) {
    throw new Error(e.message);
  }
};

const cancelAxiosRequests = (source) => {
  source.cancel('Cancelling request');
};

const AxiosRequests = {
  completeTask: completeTargetingTask,
  dismissTask: dismissTargetingTask,
  filtersCount: getFiltersAndSelectorsCount,
  getTasks: getTaskList,
  getRules: getRulesOptions,
  informationSheet: getInformationSheet,
  saveNote: saveTaskNote,
  submitTis: submitTargetInformationSheet,
  taskCount: getTaskCount,
  taskData: getTaskData,
  cancel: cancelAxiosRequests,
};

export default AxiosRequests;

export { completeTargetingTask,
  dismissTargetingTask,
  getFiltersAndSelectorsCount,
  getInformationSheet,
  getRulesOptions,
  getTaskCount,
  getTaskData,
  getTaskList,
  saveTaskNote,
  submitTargetInformationSheet };
