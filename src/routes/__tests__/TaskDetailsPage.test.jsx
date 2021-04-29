import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TaskDetailsPage from '../TaskDetailsPage';
import taskDetailsVariableInstanceResponse from '../__fixtures__/taskDetailsVariableInstanceResponse.fixture.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ taskId: 'taskId' }),
}));

describe('TaskDetailsPage', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render TaskDetailsPage component with a loading state', () => {
    render(<TaskDetailsPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render Issue Target button when current user is assigned user, and open issue target form on click', async () => {
    mockAxios
      .onGet('/task/taskId')
      .reply(200, {
        processInstanceId: '123',
        assignee: 'test',
        id: 'task123',
      })
      .onGet('/variable-instance', { params: { processInstanceIdIn: '123', deserializeValues: false } })
      .reply(200, taskDetailsVariableInstanceResponse)
      .onGet('/history/user-operation', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200,
        [{
          operationType: 'Claim',
          property: 'assignee',
          orgValue: null,
          timestamp: '2021-04-06T15:30:42.420+0000',
          userId: 'testuser@email.com',
        }])
      .onGet('/history/task', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200,
        [{
          assignee: 'testuser@email.com',
          startTime: '2021-04-20T10:50:25.869+0000',
          name: 'Investigate Error',
        }])
      .onGet('/form/name/noteCerberus')
      .reply(200,
        { test });

    render(<TaskDetailsPage />);
    await waitFor(() => expect(screen.getByText(/Task details/i)).toBeTruthy());
    await waitFor(() => expect(screen.getByText(/Assigned to you/i)).toBeTruthy());
    await waitFor(() => expect(screen.getByText(/Issue target/i)).toBeTruthy());

    // Click the button
    const issueTargetButton = screen.getByText(/Issue target/i);
    fireEvent.click(issueTargetButton);
    expect(screen.getByText(/Check the details before issuing target/i)).toBeTruthy();
  });
});
