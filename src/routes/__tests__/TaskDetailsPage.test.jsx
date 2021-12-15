import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';
import TaskDetailsPage from '../TaskDetails/TaskDetailsPage';
import variableInstanceStatusNew from '../__fixtures__/variableInstanceStatusNew.fixture.json';
import variableInstanceStatusComplete from '../__fixtures__/variableInstanceStatusComplete.fixture.json';
import variableInstanceStatusIssued from '../__fixtures__/variableInstanceStatusIssued.fixture.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ businessKey: 'BUSINESS_KEY' }),
}));

describe('TaskDetailsPage', () => {
  const mockAxios = new MockAdapter(axios);
  // let mockTaskDetailsAxiosResponses;
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  const operationsHistoryFixture = [{
    operationType: 'Claim',
    property: 'assignee',
    orgValue: null,
    timestamp: '2021-04-06T15:30:42.420+0000',
    userId: 'testuser@email.com',
  }];
  const taskHistoryFixture = [{
    assignee: 'testuser@email.com',
    startTime: '2021-04-20T10:50:25.869+0000',
    name: 'Investigate Error',
  }];

  const mockTaskDetailsAxiosCalls = ({
    processInstanceResponse,
    taskResponse,
    variableInstanceResponse,
    operationsHistoryResponse,
    taskHistoryResponse,
    noteFormResponse,
  }) => {
    mockAxios
      .onGet('/process-instance', {
        params: {
          businessKey: 'BUSINESS_KEY',
          processDefinitionKeyNotIn: 'raiseMovement,noteSubmissionWrapper',
        },
      })
      .reply(200, processInstanceResponse)
      .onGet('/task', { params: { processInstanceId: '123' } })
      .reply(200, taskResponse)
      .onGet('/history/variable-instance', { params: { processInstanceIdIn: '123', deserializeValues: false } })
      .reply(200, variableInstanceResponse)
      .onGet('/history/user-operation', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, operationsHistoryResponse)
      .onGet('/history/task', { params: { processInstanceId: '123', deserializeValues: false } })
      .reply(200, taskHistoryResponse)
      .onGet('/form/name/noteCerberus')
      .reply(200, noteFormResponse);
  };

  it('should render TaskDetailsPage component with a loading state', () => {
    render(<TaskDetailsPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render Issue Target button when current user is assigned user, and open issue target form on click', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: 'test',
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Assigned to you/i)).toBeInTheDocument();
    expect(screen.getByText(/Issue target/i)).toBeInTheDocument();

    // Click the button
    const issueTargetButton = screen.getByText(/Issue target/i);
    fireEvent.click(issueTargetButton);
    expect(screen.getByText(/Check the details before issuing target/i)).toBeInTheDocument();
  });

  it('should render "Claim" button when user is not assigned to the task, the task assignee is null and the target has not been completed or issued', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: null,
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Task not assigned')).toBeInTheDocument();
    expect(screen.queryByText('Claim')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should render "Unclaim" button when current user is assigned to the task and the target has not been completed or issued', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: 'test',
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to you')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).toBeInTheDocument();
    expect(screen.queryByText('Claim task')).not.toBeInTheDocument();
  });

  it('should render "Assigned to ANOTHER_USER" when user is not assigned to the task, the task assignee is not null and the process has not been completed or issued', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: 'ANOTHER_USER',
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to ANOTHER_USER')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is complete', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: null,
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusComplete,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to ANOTHER_USER')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is issued', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: null,
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusIssued,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to ANOTHER_USER')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
  });

  it('should not render action forms when target task type is not equal to "developTarget"', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: 'test',
        id: 'task123',
        taskDefinitionKey: 'otherType',
      }],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Assigned to you')).toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).toBeInTheDocument();
    expect(screen.queryByText('Issue target')).not.toBeInTheDocument();
    expect(screen.queryByText('Assessment complete')).not.toBeInTheDocument();
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('should not render haulier, goods & account section', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [
        {
          processInstanceId: '123',
          assignee: 'test',
          id: 'task123',
          taskDefinitionKey: 'otherType',
        },
      ],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryAllByText('Haulier details')).toHaveLength(0);
    expect(screen.queryAllByText('Goods')).toHaveLength(0);
    expect(screen.queryAllByText('Account details')).toHaveLength(0);
  });

  it('should not render vehicle section', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [
        {
          processInstanceId: '123',
          assignee: 'test',
          id: 'task123',
          taskDefinitionKey: 'otherType',
        },
      ],
      variableInstanceResponse: variableInstanceStatusIssued,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryAllByText('Vehicle details')).toHaveLength(0);
  });

  it('should not render passenger section', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [
        {
          processInstanceId: '123',
          assignee: 'test',
          id: 'task123',
          taskDefinitionKey: 'otherType',
        },
      ],
      variableInstanceResponse: variableInstanceStatusComplete,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryAllByText('Passenger')).toHaveLength(0);
  });

  it('should handle form service errors gracefully', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [{
        processInstanceId: '123',
        assignee: 'test',
        id: 'task123',
        taskDefinitionKey: 'developTarget',
      }],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    // Overwrite response defined in mockTaskDetailsAxiosCalls for notes form to test form service error handling
    mockAxios.onGet('/form/name/noteCerberus').reply(404);

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });

  it('should render indicators in task versions', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [
        {
          processInstanceId: '123',
          assignee: 'test',
          id: 'task123',
          taskDefinitionKey: 'otherType',
        },
      ],
      variableInstanceResponse: variableInstanceStatusComplete,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryAllByText('Indicator')).toHaveLength(1);
  });

  it('should not render indicators in task versions when none are present', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [
        {
          processInstanceId: '123',
          assignee: 'test',
          id: 'task123',
          taskDefinitionKey: 'otherType',
        },
      ],
      variableInstanceResponse: variableInstanceStatusIssued,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryAllByText('Indicator')).toHaveLength(0);
  });

  it('should indicate that a version is the latest', async () => {
    mockTaskDetailsAxiosCalls({
      processInstanceResponse: [{ id: '123' }],
      taskResponse: [
        {
          processInstanceId: '123',
          assignee: 'test',
          id: 'task123',
          taskDefinitionKey: 'otherType',
        },
      ],
      variableInstanceResponse: variableInstanceStatusNew,
      operationsHistoryResponse: operationsHistoryFixture,
      taskHistoryResponse: taskHistoryFixture,
      noteFormResponse: { test },
    });

    await waitFor(() => render(<TaskDetailsPage />));

    expect(screen.queryByText('Version 1 (latest)')).toBeInTheDocument();
  });
});
