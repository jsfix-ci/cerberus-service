import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';
import TaskDetailsPage from '../TaskDetails/TaskDetailsPage';
import dataCurrentUser from '../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import dataTargetIssued from '../__fixtures__/taskData_AirPax_TargetIssued.fixtures.json';
import dataTaskComplete from '../__fixtures__/taskData_AirPax_TaskComplete.fixture.json';
import dataClaimedTask from '../__fixtures__/taskData_AirPax_ClaimedTask.fixture.json';
import airlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

// Extend the react-router-dom mock from jest.setup.jsx.
const extendedRouterMock = jest.requireMock('react-router-dom');
extendedRouterMock.useParams = jest.fn().mockReturnValue({ businessKey: 'BK-123' });

describe('Task details page', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render TaskDetailsPage component with a loading state', () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, [])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: [] });

    render(<TaskDetailsPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should display the business key', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.getByText('BK-123')).toBeInTheDocument();
  });

  it('should display the activity log', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.getByText('Task activity')).toBeInTheDocument();
  });

  it('should not render notes form when task not assigned', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should not render notes form when task is assigned to someone other than the current user', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataOtherUser)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should render notes form when task is assigned to a current user', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataCurrentUser)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
  });

  it('should render "Claim" button when the task assignee is null and the target has not been completed or issued', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataNoAssignee);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Task not assigned')).toBeInTheDocument();
    expect(screen.getByText('Claim')).toBeInTheDocument();
  });

  it('should render "Unclaim" button when current user is assigned to the task and the target has not been completed or issued', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataCurrentUser);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Assigned to you')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should render "Assigned to ANOTHER_USER" & "unclaim" when task is assigned to another user and the process has not been completed or issued', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataOtherUser);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Assigned to notcurrentuser')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is complete', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataTaskComplete);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.queryByText('Task not assigned')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is issued', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataTargetIssued);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.queryByText('Task not assigned')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not show action buttons for unclaim tasks', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataTargetIssued);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.queryByText('Issue target')).not.toBeInTheDocument();
    expect(screen.queryByText('Assessment complete')).not.toBeInTheDocument();
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('should show action buttons for claimed tasks', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataClaimedTask);

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.queryByText('Unclaim task')).toBeInTheDocument();
    expect(screen.queryByText('Dismiss')).toBeInTheDocument();
    expect(screen.queryByText('Issue target')).toBeInTheDocument();
    expect(screen.queryByText('Assessment complete')).toBeInTheDocument();
  });
});
