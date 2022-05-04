import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';
import TaskDetailsPage from '../TaskDetails/TaskDetailsPage';
import dataCurrentUser from '../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import airlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

// mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ businessKey: 'BK-123' }),
}));

describe('Task details page', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  it('should render TaskDetailsPage component with a loading state', () => {
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
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('BK-123')).toBeInTheDocument();
  });

  it('should display the activity log', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Task activity')).toBeInTheDocument();
  });

  it('should not render notes form when task not assigned', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should not render notes form when task is assigned to someone other than the current user', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataOtherUser)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should render notes form when task is assigned to a current user', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, dataCurrentUser)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(<TaskDetailsPage />));
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
  });

  // it('should render "Claim" button when user is not assigned to the task, the task assignee is null and the target has not been completed or issued', async () => {
  // });

  // it('should render "Unclaim" button when current user is assigned to the task and the target has not been completed or issued', async () => {
  // });

  // it('should render "Assigned to ANOTHER_USER" when user is not assigned to the task, the task assignee is not null and the process has not been completed or issued', async () => {
  // });

  // it('should not render user or claim/unclaim buttons when a target is complete', async () => {
  // });

  // it('should not render user or claim/unclaim buttons when a target is issued', async () => {
  // });

  // it('should not render action forms when target task type is not equal to "developTarget"', async () => {
  // });

  // it('should render Issue Target button when current user is assigned user, and open issue target form on click', () => {
  // });
});
