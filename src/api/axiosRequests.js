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
    throw new Error(e);
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
    throw new Error(e);
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
    throw new Error(e);
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
    throw new Error(e);
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
    throw new Error(e);
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
    throw new Error(e);
  }
};

const cancelAxiosRequests = (source) => {
  source.cancel('Cancelling request');
};

const AxiosRequests = {
  filtersCount: getFiltersAndSelectorsCount,
  getTasks: getTaskList,
  getRules: getRulesOptions,
  informationSheet: getInformationSheet,
  taskCount: getTaskCount,
  taskData: getTaskData,
  cancel: cancelAxiosRequests,
};

export default AxiosRequests;

export { getFiltersAndSelectorsCount, getInformationSheet, getRulesOptions, getTaskCount, getTaskData, getTaskList };
