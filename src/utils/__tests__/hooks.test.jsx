/* eslint-disable jest/expect-expect */
import React from 'react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { renderHook } from '@testing-library/react-hooks';
import { useIsMounted, useGetRefDataAirlineCodes, useGetAirpaxRefDataMode } from '../hooks';

import refDataAirlineCodes from '../../routes/airpax/__fixtures__/taskData_Airpax_AirlineCodes.json';
import airPaxRefDataMode from '../../routes/airpax/__fixtures__/taskData_Airpax_AixpaxRefDataMode.json';

import { ApplicationContext } from '../../context/ApplicationContext';

describe('axios hooks', () => {
  const mockAxios = new MockAdapter(axios);

  it('can mount', () => {
    const mounted = renderHook(() => useIsMounted());

    expect(mounted.result.current.current).toBe(true);

    mounted.unmount();

    expect(mounted.result.current.current).toBe(false);
  });

  it('can fetch airline codes', () => {
    mockAxios.onGet('/v2/entities/carrierlist').reply(200, refDataAirlineCodes);

    const { Provider } = ApplicationContext;

    const wrapper = ({ children }) => (
      <Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes) }}>
        {children}
      </Provider>
    );

    renderHook(() => useGetRefDataAirlineCodes(), { wrapper });
  });

  it('can fetch airpax mode', () => {
    mockAxios.onGet('/v2/entities/targetmode').reply(200, airPaxRefDataMode);

    const { Provider } = ApplicationContext;

    const wrapper = ({ children }) => (
      <Provider value={{ airPaxRefDataMode: jest.fn().mockReturnValue(airPaxRefDataMode) }}>
        {children}
      </Provider>
    );

    renderHook(() => useGetAirpaxRefDataMode(), { wrapper });
  });
});
