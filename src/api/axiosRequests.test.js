import AxiosRequests from './axiosRequests';

describe('AxiosRequests', () => {
  it('should call the filters count api function and verify response', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.resolve({ data: { bravo: 'bravo' } })),
    };
    const response = await AxiosRequests.filtersCount(axiosInstance, {});
    expect(response).toMatchObject({ bravo: 'bravo' });
  });

  it('should throw an error on filters count api request failure', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.reject(new Error('test-error'))),
    };
    await expect(AxiosRequests.filtersCount(axiosInstance, {}))
      .rejects
      .toEqual(Error('test-error'));
  });

  it('should call the tasks list api function and verify response', async () => {
    const data = [{ alpha: 'alpha' }, { bravo: 'bravo' }];
    const axiosInstance = {
      post: jest.fn(() => Promise.resolve({ data: [{ alpha: 'alpha' }, { bravo: 'bravo' }] })),
    };
    const response = await AxiosRequests.getTasks(axiosInstance, {});
    expect(response).toMatchObject(data);
  });

  it('should throw an error on get tasks api request failure', async () => {
    const axiosInstance = {
      post: jest.fn(() => Promise.reject(new Error('test-error'))),
    };
    await expect(AxiosRequests.getTasks(axiosInstance, {}))
      .rejects
      .toEqual(Error('test-error'));
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
      get: jest.fn(() => Promise.reject(new Error('test-error'))),
    };
    await expect(AxiosRequests.getRules(axiosInstance, {}))
      .rejects
      .toEqual(Error('test-error'));
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
      get: jest.fn(() => Promise.reject(new Error('test-error'))),
    };
    await expect(AxiosRequests.informationSheet(axiosInstance, {}))
      .rejects
      .toEqual(Error('test-error'));
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
      post: jest.fn(() => Promise.reject(new Error('test-error'))),
    };
    await expect(AxiosRequests.taskCount(axiosInstance, {}))
      .rejects
      .toEqual(Error('test-error'));
  });
});
