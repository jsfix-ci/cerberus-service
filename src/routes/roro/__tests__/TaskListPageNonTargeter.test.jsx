import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import '../../../__mocks__/keycloakNonTargeterMock';
import TaskListPage from '../TaskLists/TaskListPage';

describe('TaskListPage for non targeter', () => {
  const mockAxios = new MockAdapter(axios);
  jest.mock('../../../__mocks__/keycloakNonTargeterMock');
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('Should not load tasks if user does not have the correct targeter group', async () => {
    mockAxios
      .onGet('/task/count')
      .reply(200, { count: 7 })
      .onGet('/process-instance/count')
      .reply(200, { count: 5 })
      .onGet('/history/process-instance/count')
      .reply(200, { count: 0 });

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));
    expect(screen.getByText('You are not authorised to view these tasks.')).toBeInTheDocument();
  });
});
