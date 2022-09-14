/* eslint-disable jest/expect-expect */
import React from 'react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { renderHook } from '@testing-library/react-hooks';
import { useIsMounted, useGetRefDataAirlineCodes } from './hooks';

import refDataAirlineCodes from '../../__fixtures__/airpax-airline-codes.json';

import { ApplicationContext } from '../../context/ApplicationContext';

describe('axios Hooks', () => {
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
});
