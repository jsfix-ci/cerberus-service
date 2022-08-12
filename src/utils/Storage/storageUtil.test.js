import { RORO_TASK_STATUS_KEY, TASK_STATUS_NEW } from '../constants';

import { getTaskStatus, getLocalStoredItemByKeyValue } from './storageUtil';

describe('StorageUtil', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the set task id', () => {
    const EXPECTED = 'test-task-id';
    localStorage.setItem(RORO_TASK_STATUS_KEY, EXPECTED);

    const output = getTaskStatus(RORO_TASK_STATUS_KEY);
    expect(output).toEqual(EXPECTED);
  });

  it(`should return task status "${TASK_STATUS_NEW}" if none has been set in local storage`, () => {
    const output = getTaskStatus(RORO_TASK_STATUS_KEY);
    expect(output).toEqual(TASK_STATUS_NEW);
  });

  it('should return stored data', () => {
    const KEY = 'key';
    const DATA_TO_STORE = { alpha: 'alpha', bravo: 'bravo' };
    localStorage.setItem(KEY, JSON.stringify(DATA_TO_STORE));

    const storedData = getLocalStoredItemByKeyValue(KEY);
    expect(storedData).toMatchObject(DATA_TO_STORE);
  });

  it('should evaluate to false if stored data is not found', () => {
    const KEY = 'key';
    const storedData = getLocalStoredItemByKeyValue(KEY);
    expect(storedData).toBeFalsy();
  });

  it('should return data item within stored data', () => {
    const KEY = 'key';
    const DATA_TO_STORE = { alpha: 'alpha', bravo: 'bravo' };
    localStorage.setItem(KEY, JSON.stringify(DATA_TO_STORE));

    const storedDataItem = getLocalStoredItemByKeyValue(KEY, 'alpha');
    expect(storedDataItem).toEqual(DATA_TO_STORE.alpha);
  });

  it('should evaluate returned data to false if data item within stored data is not found', () => {
    const KEY = 'key';
    const DATA_TO_STORE = { alpha: 'alpha', bravo: 'bravo' };
    localStorage.setItem(KEY, JSON.stringify(DATA_TO_STORE));

    const storedDataItem = getLocalStoredItemByKeyValue(KEY, 'charlie');
    expect(storedDataItem).toBeFalsy();
  });
});
