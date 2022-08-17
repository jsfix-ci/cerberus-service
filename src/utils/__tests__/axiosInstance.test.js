import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';
import useAxiosInstance from '../axiosInstance';

describe('axios hooks', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
  });

  test('can perform a API call', async () => {
    mockAxios.onGet('/api/data').reply(200, [{ id: 'test' }]);
    const axiosInstance = renderHook(() => useAxiosInstance());

    const result = await axiosInstance.result.current.get('/api/data');
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(1);
  });

  test('should have an access Bearer token for API calls', async () => {
    const keycloak = { token: 'test-token' };
    mockAxios.onGet('/api/data').reply(200, [{ id: 'test' }]);
    const axiosInstance = renderHook(() => useAxiosInstance(keycloak));
    await axiosInstance.result.current.get('/api/data');
    expect(mockAxios.history.get[0].headers.Authorization).toEqual(`Bearer ${keycloak.token}`);
  });
});
