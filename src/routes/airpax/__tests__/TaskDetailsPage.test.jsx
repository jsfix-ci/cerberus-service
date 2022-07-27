import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';

import { ApplicationContext } from '../../../context/ApplicationContext';

import TaskDetailsPage from '../TaskDetails/TaskDetailsPage';
import dataCurrentUser from '../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import dataTargetIssued from '../__fixtures__/taskData_AirPax_TargetIssued.fixtures.json';
import dataTaskComplete from '../__fixtures__/taskData_AirPax_TaskComplete.fixture.json';
import dataClaimedTask from '../__fixtures__/taskData_AirPax_ClaimedTask.fixture.json';
import dataDismissedTask from '../__fixtures__/taskData_AirPax_DismissedTask.json';

import refDataAirlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

// Extend the react-router-dom mock from jest.setup.jsx.
const extendedRouterMock = jest.requireMock('react-router-dom');
extendedRouterMock.useParams = jest.fn().mockReturnValue({ businessKey: 'BK-123' });

describe('Task details page', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
  });

  const mockAxiosCalls = (mockTaskPayload, mockIsPayload) => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(200, mockTaskPayload)
      .onGet('/targeting-tasks/BK-123/information-sheets')
      .reply(200, mockIsPayload);
  };

  const MockApplicationContext = ({ children }) => (
    <ApplicationContext.Provider value={{ refDataAirlineCodes }}>
      {children}
    </ApplicationContext.Provider>
  );

  const renderPage = async () => render(
    <MockApplicationContext>
      <TaskDetailsPage />
    </MockApplicationContext>,
  );

  it('should render TaskDetailsPage component with a loading state', () => {
    mockAxiosCalls([], {});

    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should display the business key', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.getByText('BK-123')).toBeInTheDocument();
  });

  it('should display the activity log', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.getByText('Task activity')).toBeInTheDocument();
  });

  it('should not render notes form when task not assigned', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should not render notes form when task is assigned to someone other than the current user', async () => {
    mockAxiosCalls(dataOtherUser, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should render notes form when task is assigned to a current user', async () => {
    mockAxiosCalls(dataCurrentUser, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(4);
    expect(screen.queryByText('Add a new note')).toBeInTheDocument();
  });

  it('should render "Claim" button when the task assignee is null and the target has not been completed or issued', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getByText('Task not assigned')).toBeInTheDocument();
    expect(screen.getByText('Claim')).toBeInTheDocument();
  });

  it('should render "Unclaim" button when current user is assigned to the task and the target has not been completed or issued', async () => {
    mockAxiosCalls(dataCurrentUser, {});

    await waitFor(() => renderPage());

    expect(screen.getByText('Assigned to you')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should render "Assigned to ANOTHER_USER" & "unclaim" when task is assigned to another user and the process has not been completed or issued', async () => {
    mockAxiosCalls(dataOtherUser, {});

    await waitFor(() => renderPage());

    expect(screen.getByText('Assigned to notcurrentuser')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is complete', async () => {
    mockAxiosCalls(dataTaskComplete, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Task not assigned')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not render user or claim/unclaim buttons when a target is issued', async () => {
    mockAxiosCalls(dataTargetIssued, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Task not assigned')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not show action buttons for unclaimed tasks', async () => {
    mockAxiosCalls(dataTargetIssued, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Issue target')).not.toBeInTheDocument();
    expect(screen.queryByText('Assessment complete')).not.toBeInTheDocument();
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });

  it('should show action buttons for claimed tasks', async () => {
    mockAxiosCalls(dataClaimedTask, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Unclaim task')).toBeInTheDocument();
    expect(screen.queryByText('Dismiss')).toBeInTheDocument();
    expect(screen.queryByText('Issue target')).toBeInTheDocument();
    expect(screen.queryByText('Assessment complete')).toBeInTheDocument();
  });

  it('should render a new label on a new and unclamied task', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    const { container } = await waitFor(() => renderPage());

    expect(container.getElementsByClassName('govuk-tag--newTarget')).toHaveLength(1);
  });

  it('should not render a new label on a claimed task', async () => {
    mockAxiosCalls(dataClaimedTask, {});

    const { container } = await waitFor(() => renderPage());

    expect(container.getElementsByClassName('govuk-tag--newTarget')).toHaveLength(0);
  });

  it('should not render a new label on an issued task', async () => {
    mockAxiosCalls(dataTargetIssued, {});

    const { container } = await waitFor(() => renderPage());

    expect(container.getElementsByClassName('govuk-tag--newTarget')).toHaveLength(0);
  });

  it('should not render a new label on a complete task', async () => {
    mockAxiosCalls(dataTaskComplete, {});

    const { container } = await waitFor(() => renderPage());

    expect(container.getElementsByClassName('govuk-tag--newTarget')).toHaveLength(0);
  });

  it('should not show action buttons for task that has been dismissed', async () => {
    mockAxiosCalls(dataDismissedTask, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    expect(screen.queryByText('Issue target')).not.toBeInTheDocument();
    expect(screen.queryByText('Assessment complete')).not.toBeInTheDocument();
  });

  it('should hide the notes form on clicking the assessment complete button', async () => {
    mockAxiosCalls(dataClaimedTask, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Add a new note')).toBeInTheDocument();

    const assessmentCompleteButton = screen.getByRole('button', { name: 'Assessment complete' });
    fireEvent.click(assessmentCompleteButton);

    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should hide the notes form on clicking the dismiss button', async () => {
    mockAxiosCalls(dataClaimedTask, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Add a new note')).toBeInTheDocument();

    const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
    fireEvent.click(dismissButton);

    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should hide the notes form on clicking the issue target button', async () => {
    mockAxiosCalls(dataClaimedTask, {});

    await waitFor(() => renderPage());

    expect(screen.queryByText('Add a new note')).toBeInTheDocument();

    const issueTargetButton = screen.getByRole('button', { name: 'Issue target' });
    fireEvent.click(issueTargetButton);

    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should render an error summary on failure to fetch the airpax target information sheet form', async () => {
    mockAxiosCalls(dataClaimedTask, {});
    mockAxios
      .onGet('/copform/name/cerberus-airpax-target-information-sheet')
      .reply(404);

    await waitFor(() => renderPage());

    const issueTargetButton = screen.getByRole('button', { name: 'Issue target' });
    await waitFor(() => fireEvent.click(issueTargetButton));

    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).toBeInTheDocument();
  });
});
