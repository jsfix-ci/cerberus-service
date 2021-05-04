import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TaskListPage from '../TaskLists/TaskListPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
  useLocation: () => ({
    search: 'test',
  }),
}));

describe('TaskListPage', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render loading spinner on component load', () => {
    render(<TaskListPage taskStatus="new" setError={() => { }} />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
  it('should render a list of tasks when New, In Progress and Complete tabs are clicked', async () => {
    mockAxios
      .onGet('/task')
      .reply(200, [])
      .onGet('/task/count')
      .reply(200, { count: 0 })
      .onGet('/variable-instance')
      .reply(200, [])
      .onGet('/history/process-instance')
      .reply(200, [])
      .onGet('/history/process-instance/count')
      .reply(200, { count: 0 })
      .onGet('/history/variable-instance')
      .reply(200, []);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByText('In progress')));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByText('Complete')));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();
  });
  it('should handle errors gracefully', async () => {
    mockAxios
      .onGet('/task')
      .reply(500);

    await waitFor(() => render(<TaskListPage taskStatus="new" setError={() => { }} />));

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 500')).toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });
});
