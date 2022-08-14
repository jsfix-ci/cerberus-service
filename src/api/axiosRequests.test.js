import AxiosRequests from './axiosRequests';

describe('AxiosRequests', () => {
  const ERROR_MESSAGE = 'test-error';
  const EXPECTED_ERROR = new Error(ERROR_MESSAGE);

  it('should call the filters count api function and verify response', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.resolve({ data: { bravo: 'bravo' } })),
    };
    const response = await AxiosRequests.filtersCount(axiosInstance, {});
    expect(response).toMatchObject({ bravo: 'bravo' });
  });

  it('should throw an error on filters count api request failure', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.reject(ERROR_MESSAGE)),
    };
    await expect(AxiosRequests.filtersCount(axiosInstance, {}))
      .rejects
      .toEqual(EXPECTED_ERROR);
  });

  it('should call the get tasks list api function and verify response', async () => {
    const data = [{ alpha: 'alpha' }, { bravo: 'bravo' }];
    const axiosInstance = {
      post: jest.fn(() => Promise.resolve({ data: [{ alpha: 'alpha' }, { bravo: 'bravo' }] })),
    };
    const response = await AxiosRequests.getTasks(axiosInstance, {});
    expect(response).toMatchObject(data);
  });

  it('should throw an error on get tasks api request failure', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.reject(ERROR_MESSAGE)),
    };
    await expect(AxiosRequests.getTasks(axiosInstance, {}))
      .rejects
      .toEqual(EXPECTED_ERROR);
  });

  it('should call the task data api function and verify response', async () => {
    const data = [{ alpha: 'alpha' }, { bravo: 'bravo' }];
    const axiosInstance = {
      get: jest.fn(() => Promise.resolve({ data })),
    };
    const response = await AxiosRequests.taskData(axiosInstance, 'BK-123');
    expect(response).toMatchObject(data);
  });

  it('should throw an error on get task data api request failure', async () => {
    const axiosInstance = {
      get: jest.fn(() => Promise.reject(ERROR_MESSAGE)),
    };
    await expect(AxiosRequests.taskData(axiosInstance, 'BK-123'))
      .rejects
      .toEqual(EXPECTED_ERROR);
  });

  it('should call the rules api function and verify response', async () => {
    const data = [{ alpha: 'alpha' }, { bravo: 'bravo' }];
    const axiosInstance = {
      get: jest.fn(() => Promise.resolve({ data: [{ alpha: 'alpha' }, { bravo: 'bravo' }] })),
    };
    const response = await AxiosRequests.getRules(axiosInstance);
    expect(response).toMatchObject(data);
  });

  it('should throw an error on rules api request failure', async () => {
    const axiosInstance = {
      get: jest.fn(() => Promise.reject(ERROR_MESSAGE)),
    };
    await expect(AxiosRequests.getRules(axiosInstance))
      .rejects
      .toEqual(EXPECTED_ERROR);
  });

  it('should call the information sheet api function and verify response', async () => {
    const data = { alpha: 'alpha' };
    const axiosInstance = {
      get: jest.fn(() => Promise.resolve({ data: { alpha: 'alpha' } })),
    };
    const response = await AxiosRequests.informationSheet(axiosInstance, 'ALPHA_KEY');
    expect(response).toMatchObject(data);
  });

  it('should throw an error on information sheet api request failure', async () => {
    const axiosInstance = {
      get: jest.fn(() => Promise.reject(ERROR_MESSAGE)),
    };
    await expect(AxiosRequests.informationSheet(axiosInstance, {}))
      .rejects
      .toEqual(EXPECTED_ERROR);
  });

  it('should call the task count api function and verify response', async () => {
    const data = { statusCounts: 1 };
    const axiosInstance = {
      post: jest.fn(() => Promise.resolve({ data: [{ ...data }] })),
    };
    const response = await AxiosRequests.taskCount(axiosInstance, {});
    expect(response).toEqual(1);
  });

  it('should throw an error on the task count api request failure', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.reject(ERROR_MESSAGE)),
    };
    await expect(AxiosRequests.taskCount(axiosInstance, {}))
      .rejects
      .toEqual(EXPECTED_ERROR);
  });

  it('should call the request cancellation handler', () => {
    const CANCELS = [];
    const ON_CANCEL = (value) => {
      CANCELS.push(value);
    };
    const source = {
      cancel: (msg) => ON_CANCEL(msg),
    };

    AxiosRequests.cancel(source);
    expect(CANCELS).toHaveLength(1);
    expect(CANCELS[0]).toEqual('Cancelling request');
  });
});
