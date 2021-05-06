import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TaskDetailsPage from '../TaskDetails/TaskDetailsPage';
import taskDetailsVariableInstanceResponse from '../__fixtures__/taskDetailsVariableInstanceResponse.fixture.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ processInstanceId: '123' }),
}));

describe('TaskDetailsPage', () => {
  const mockAxios = new MockAdapter(axios);
  let mockTaskDetailsAxiosResponses;
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
    mockTaskDetailsAxiosResponses = {
      taskResponse: [{
        processInstanceId: '123',
        assignee: 'test',
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: taskDetailsVariableInstanceResponse,
      operationsHistoryResponse: [{
        operationType: 'Claim',
        property: 'assignee',
        orgValue: null,
        timestamp: '2021-04-06T15:30:42.420+0000',
        userId: 'testuser@email.com',
      }],
      taskHistoryResponse: [{
        assignee: 'testuser@email.com',
        startTime: '2021-04-20T10:50:25.869+0000',
        name: 'Investigate Error',
      }],
      targetCompleteResponse: [{ id: '123' }],
      targetIssuedResponse: [],
      noteFormResponse: { test },
    };
  });

  const mockTaskDetailsAxiosCalls = ({
    taskResponse,
    variableInstanceResponse,
    operationsHistoryResponse,
    taskHistoryResponse,
    targetCompleteResponse,
    targetIssuedResponse,
    noteFormResponse,
  }) => {
    mockAxios
      .onGet('/task', { params: { processInstanceId: '123' } })
      .reply(200, taskResponse)
      .onGet('/history/variable-instance', { params: { processInstanceIdIn: '123', deserializeValues: false } })
      .reply(200, variableInstanceResponse)
      .onGet('/history/user-operation', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, operationsHistoryResponse)
      .onGet('/history/task', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, taskHistoryResponse)
      .onGet('/process-instance', { params: { processInstanceIds: '123', variables: 'processState_neq_Complete' } })
      .reply(200, targetCompleteResponse)
      .onGet('/process-instance', { params: { processInstanceIds: '123', variables: 'processState_eq_Issued' } })
      .reply(200, targetIssuedResponse)
      .onGet('/form/name/noteCerberus')
      .reply(200, noteFormResponse);
  };

  it('should render TaskDetailsPage component with a loading state', () => {
    render(<TaskDetailsPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render Issue Target button when current user is assigned user, and open issue target form on click', async () => {
    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.getByText(/Task details/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned to you/i)).toBeInTheDocument();
    expect(screen.getByText(/Issue target/i)).toBeInTheDocument();

    // Click the button
    const issueTargetButton = screen.getByText(/Issue target/i);
    fireEvent.click(issueTargetButton);
    expect(screen.getByText(/Check the details before issuing target/i)).toBeInTheDocument();
  });

  it('should render "Claim" button when user is not assigned to the task, the task assignee is null and the target has not been completed or issued', async () => {
    mockTaskDetailsAxiosResponses.taskResponse[0].assignee = null;

    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Unassigned')).toBeInTheDocument();
    expect(screen.queryByText('Claim')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
  });

  it('should render "Unclaim" button when user is not assigned to the task and the target has not been completed or issued', async () => {
    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to you')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should render "Assigned to ANOTHER_USER" when user is not assigned to the task, the task assignee is not null and the process has not been completed or issued', async () => {
    mockTaskDetailsAxiosResponses.taskResponse[0].assignee = 'ANOTHER_USER';

    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to ANOTHER_USER')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is complete and target is not issued', async () => {
    mockTaskDetailsAxiosResponses.taskResponse[0].assignee = 'ANOTHER_USER';
    mockTaskDetailsAxiosResponses.taskResponse = [];
    mockTaskDetailsAxiosResponses.targetCompleteResponse = [];

    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to ANOTHER_USER')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is issued and target is not complete', async () => {
    mockTaskDetailsAxiosResponses.taskResponse[0].assignee = 'ANOTHER_USER';
    mockTaskDetailsAxiosResponses.taskResponse = [];
    mockTaskDetailsAxiosResponses.targetIssuedResponse = [{ id: '123' }];

    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to ANOTHER_USER')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should not render action forms when target task type is not equal to "developTarget"', async () => {
    mockTaskDetailsAxiosResponses.taskResponse = [{
      processInstanceId: '123',
      assignee: 'test',
      id: 'task123',
      taskDefinitionKey: 'NOT_DEVELOP_TARGET',
    }];

    mockTaskDetailsAxiosCalls({ ...mockTaskDetailsAxiosResponses });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to you')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });
});
