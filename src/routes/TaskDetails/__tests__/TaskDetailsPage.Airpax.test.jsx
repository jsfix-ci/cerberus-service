import _ from 'lodash';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';

import { ApplicationContext } from '../../../context/ApplicationContext';
import { ViewContext } from '../../../context/ViewContext';

import TaskDetailsPage from '../TaskDetailsPage';

import dataCurrentUser from '../../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../../../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../../../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import dataTargetIssued from '../../../__fixtures__/taskData_AirPax_TargetIssued.fixtures.json';
import dataTaskComplete from '../../../__fixtures__/taskData_AirPax_TaskComplete.fixture.json';
import dataClaimedTask from '../../../__fixtures__/taskData_AirPax_ClaimedTask.fixture.json';
import dataDismissedTask from '../../../__fixtures__/taskData_AirPax_DismissedTask.json';

import refDataAirlineCodes from '../../../__fixtures__/airpax-airline-codes.json';
import { TASK_STATUS } from '../../../utils/constants';
import { VIEW } from '../../../utils/Common/commonUtil';

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
    <ApplicationContext.Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes),
      airPaxTisCache: jest.fn().mockReturnValue({}),
      setAirpaxTisCache: jest.fn() }}
    >
      {children}
    </ApplicationContext.Provider>
  );

  const renderPage = async () => render(
    <MockApplicationContext>
      <ViewContext.Provider value={{ getView: jest.fn().mockReturnValue(VIEW.AIRPAX), setView: jest.fn() }}>
        <TaskDetailsPage />
      </ViewContext.Provider>
    </MockApplicationContext>,
  );

  const ACTION_BUTTONS = ['Issue target', 'Assessment complete', 'Dismiss'];

  it('should render 404 (Not found) for tasks that have been archived', async () => {
    mockAxios
      .onGet('/targeting-tasks/BK-123')
      .reply(404)
      .onGet('/targeting-tasks/BK-123/information-sheets')
      .reply(404);

    await waitFor(() => renderPage());

    expect(screen.getByText('Request failed with status code 404')).toBeInTheDocument();
  });

  it('should render TaskDetailsPage component with a loading state', () => {
    mockAxiosCalls([], {});

    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should display the business key', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(1);
    expect(screen.getByText('BK-123')).toBeInTheDocument();
  });

  it('should display the activity log', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(1);
    expect(screen.getByText('Task activity')).toBeInTheDocument();
  });

  it('should not render notes form when task not assigned', async () => {
    mockAxiosCalls(dataNoAssignee, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(1);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should not render notes form when task is assigned to someone other than the current user', async () => {
    mockAxiosCalls(dataOtherUser, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(1);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });

  it('should render notes form when task is assigned to a current user', async () => {
    mockAxiosCalls(dataCurrentUser, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(1);
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

  ACTION_BUTTONS.forEach((button) => {
    it('should hide the notes form on clicking an action button', async () => {
      mockAxiosCalls(dataClaimedTask, {});

      await waitFor(() => renderPage());

      expect(screen.queryByText('Add a new note')).toBeInTheDocument();

      const actionButton = screen.getByRole('button', { name: button });
      fireEvent.click(actionButton);

      expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
    });
  });

  ACTION_BUTTONS.forEach((button) => {
    it('should hide the action buttons', async () => {
      mockAxiosCalls(dataClaimedTask, {});

      await waitFor(() => renderPage());

      expect(screen.queryByText('Issue target')).toBeInTheDocument();
      expect(screen.queryByText('Assessment complete')).toBeInTheDocument();
      expect(screen.queryByText('Dismiss')).toBeInTheDocument();

      const actionButton = screen.getByRole('button', { name: button });
      fireEvent.click(actionButton);

      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
      expect(screen.queryByText('Issue target')).not.toBeInTheDocument();
      expect(screen.queryByText('Assessment complete')).not.toBeInTheDocument();
    });
  });

  ACTION_BUTTONS.forEach((button) => {
    it('should call the confirm dialog on cancelling a form', async () => {
      const confirmMock = jest.spyOn(window, 'confirm').mockImplementation();
      mockAxiosCalls(dataClaimedTask, {});

      await waitFor(() => renderPage());

      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();

      const actionButton = screen.getByRole('button', { name: button });
      fireEvent.click(actionButton);

      expect(screen.queryByText('Cancel')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      expect(confirmMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should not render notes form when task has been issued by the current user', async () => {
    const MOCK_DATA = _.cloneDeep(dataCurrentUser);
    MOCK_DATA.status = TASK_STATUS.ISSUED;

    mockAxiosCalls(MOCK_DATA, {});

    await waitFor(() => renderPage());

    expect(screen.getAllByText('Overview')).toHaveLength(1);
    expect(screen.queryByText('Add a new note')).not.toBeInTheDocument();
  });
});
