import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import '../../__mocks__/keycloakMock';
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';
import ClaimButton from './ClaimTaskButton';
import TaskListPage from '../../routes/roro/TaskLists/TaskListPage';

const setError = jest.fn();
const TaskAssignedWarning = jest.fn();

describe('Claim/Unclaim buttons', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render with text of claim when there is no assignee', async () => {
    const task = {
      assignee: null,
      id: '123',
    };
    mockAxios.onPost(`task/${task.id}/claim`).reply(200);

    render(<ClaimButton
      className="govuk-!-font-weight-bold"
      assignee={task.assignee}
      taskId={task.id}
      setError={setError}
    />);

    expect(screen.getByText(/Claim/i)).toBeInTheDocument();
    const unclaimButton = screen.queryByText(/Unclaim/i);
    expect(unclaimButton).not.toBeInTheDocument();
  });

  it('should post to the claim api for that task when user clicks claim', async () => {
    const task = {
      assignee: null,
      id: '123',
    };
    mockAxios.onPost(`task/${task.id}/claim`).reply(200);

    render(<ClaimButton
      className="govuk-!-font-weight-bold"
      assignee={task.assignee}
      taskId={task.id}
      setError={setError}
    />);

    await waitFor(() => { fireEvent.click(screen.getByText(/Claim/i)); });
    expect(mockAxios.history.post[0].url).toEqual(`task/${task.id}/claim`);
  });

  it('should render with text of unclaim when the assignee matches the current user', () => {
    const task = {
      assignee: 'test',
      id: '123',
    };

    render(<ClaimButton
      className="govuk-!-font-weight-bold"
      assignee={task.assignee}
      taskId={task.id}
      setError={setError}
    />);

    expect(screen.getByText(/Unclaim/i)).toBeInTheDocument();
    const claimButton = screen.queryByText('Claim');
    expect(claimButton).not.toBeInTheDocument();
  });

  it('should post to the unclaim api for that task when user clicks unclaim', async () => {
    const task = {
      assignee: 'test',
      id: '123',
    };
    mockAxios.onPost(`task/${task.id}/unclaim`).reply(200);

    render(<ClaimButton
      className="govuk-!-font-weight-bold"
      assignee={task.assignee}
      taskId={task.id}
      setError={setError}
    />);

    await waitFor(() => { fireEvent.click(screen.getByText(/Unclaim/i)); });
    expect(mockAxios.history.post[0].url).toEqual(`task/${task.id}/unclaim`);

    const tabData = {
      taskManagementTabIndex: 0,
      setTaskManagementTabIndex: jest.fn(),
    };
    await waitFor(() => render(<TaskSelectedTabContext.Provider value={tabData}><TaskListPage taskStatus="new" setError={() => { }} /></TaskSelectedTabContext.Provider>));

    expect(screen.getByText('New tasks')).toBeInTheDocument();
    expect(screen.queryByText('In progress tasks')).not.toBeInTheDocument();
    expect(screen.queryByText('Target issued tasks')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed tasks')).not.toBeInTheDocument();
  });

  it('should render with text of username when the assignee does not match the current user', async () => {
    const task = {
      assignee: 'not-current-user',
      id: '123',
    };

    render(<ClaimButton
      className="govuk-!-font-weight-bold"
      assignee={task.assignee}
      taskId={task.id}
      setError={setError}
    />);

    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Unclaim')).not.toBeInTheDocument());
    expect(screen.getByText(/Assigned to not-current-user/i)).toBeInTheDocument();
  });

  it('should handle 500', async () => {
    const task = {
      id: '123',
      assignee: 'not-current-user',
    };
    mockAxios.onPost(`task/${task.id}/claim`).reply(500);

    render(<ClaimButton
      className="govuk-!-font-weight-bold"
      assignee={task.assignee}
      taskId={task.id}
      setError={setError}
      TaskAssignedWarning={TaskAssignedWarning}
    />);

    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Unclaim')).not.toBeInTheDocument());
    expect(screen.getByText(/Assigned to not-current-user/i)).toBeInTheDocument();
  });
});
