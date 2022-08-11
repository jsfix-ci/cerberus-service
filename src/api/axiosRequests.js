const getTaskList = async (axiosClient, postParams) => {
  try {
    return await axiosClient.post('/targeting-tasks/pages', postParams)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const getRulesOptions = async (axiosClient) => {
  try {
    return await axiosClient.get('/filters/rules')
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const getTaskCount = async (axiosClient, postParams) => {
  try {
    return await axiosClient.post('/targeting-tasks/status-counts', [postParams || {}])
      .then((response) => response.data[0].statusCounts);
  } catch (e) {
    throw new Error(e.message);
  }
};

const getFiltersAndSelectorsCount = async (axiosClient, postParams) => {
  try {
    return await axiosClient.post('/targeting-tasks/status-counts', postParams)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const getInformationSheet = async (axiosClient, businessKey) => {
  try {
    return await axiosClient.get(`/targeting-tasks/${businessKey}/information-sheets`)
      .then((response) => response.data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const AxiosRequests = {
  filtersCount: getFiltersAndSelectorsCount,
  getTasks: getTaskList,
  getRules: getRulesOptions,
  informationSheet: getInformationSheet,
  taskCount: getTaskCount,
};

export default AxiosRequests;

export { getFiltersAndSelectorsCount, getInformationSheet, getRulesOptions, getTaskCount, getTaskList };
