import { TASK_STATUS } from '../constants';

const isLocalStoredPresent = (key) => {
  return localStorage.getItem(key) !== null
    && localStorage.getItem(key) !== 'null';
};

/**
 * Gets a particular field out of the stored data.
 * This can also equally return the whole stored data.
 *
 * @param {*} key The key the stored data is associated with.
 * @param {*} value The value to be returned from the stored data.
 *            Omitting this parameter will return just the whole stored data item.
 * @returns A particular item from within the stored data or the whole stored data.
 */
const getLocalStoredItemByKeyValue = (key, value = undefined) => {
  if (!isLocalStoredPresent(key)) {
    return null;
  }
  if (!value && value !== 0) {
    return JSON.parse(localStorage.getItem(key));
  }
  return JSON.parse(localStorage.getItem(key))[value];
};

const getTaskStatus = (taskStatus) => {
  return localStorage.getItem(taskStatus) !== null
    ? localStorage.getItem(taskStatus) : TASK_STATUS.NEW;
};

const StorageUtil = {
  localStorageItem: getLocalStoredItemByKeyValue,
  localStorageTaskStatus: getTaskStatus,
};

export default StorageUtil;

export { getLocalStoredItemByKeyValue, getTaskStatus };
