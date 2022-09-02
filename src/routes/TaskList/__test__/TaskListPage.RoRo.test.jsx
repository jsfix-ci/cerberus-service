import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';

// Components/Pages
import { ApplicationContext } from '../../../context/ApplicationContext';
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';
import { PnrAccessContext } from '../../../context/PnrAccessContext';
import { ViewContext } from '../../../context/ViewContext';

import TaskListPage from '../TaskListPage';

import { TASK_LIST_PATHS } from '../../../utils/constants';
import { VIEW } from '../../../utils/Common/commonUtil';

// Fixture
import roroDataCurrentUser from '../../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../../../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../../../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import dataTargetIssued from '../../../__fixtures__/taskData_AirPax_TargetIssued.fixtures.json';
import dataTaskComplete from '../../../__fixtures__/taskData_AirPax_TaskComplete.fixture.json';
import refDataAirlineCodes from '../../../__fixtures__/taskData_Airpax_AirlineCodes.json';

describe('RoRo.TaskListPage', () => {
  // Extend the react-router-dom mock from jest.setup.jsx.
  const extendedRouterMock = jest.requireMock('react-router-dom');
  extendedRouterMock.useLocation = jest.fn(() => ({ pathname: TASK_LIST_PATHS.RORO_V2 }));

  const mockAxios = new MockAdapter(axios);

  let tabData = {};

  let pnrData = {};

  const MockApplicationContext = ({ children }) => (
    <ApplicationContext.Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes) }}>
      {children}
    </ApplicationContext.Provider>
  );

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    tabData = {
      selectedTabIndex: 0,
      selectTabIndex: jest.fn(),
      selectTaskManagementTabIndex: jest.fn(),
    };

    pnrData = {
      canViewPnrData: true,
      setViewPnrData: jest.fn(),
    };

    mockAxios.reset();
  });

  const setTabAndTaskValues = (tabValue, pnrValue) => {
    return (
      <MockApplicationContext>
        <ViewContext.Provider value={{ getView: jest.fn().mockReturnValue(VIEW.RORO_V2), setView: jest.fn() }}>
          <PnrAccessContext.Provider value={pnrValue}>
            <TaskSelectedTabContext.Provider value={tabValue}>
              <TaskListPage />
            </TaskSelectedTabContext.Provider>
          </PnrAccessContext.Provider>
        </ViewContext.Provider>
      </MockApplicationContext>
    );
  };

  it('should render a claim button if the task status is new & there is no assignee', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataNoAssignee]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.getByText('Claim')).toBeInTheDocument();
  });

  it('should render an unclaim button & assigned to you if the task status is in progress and the assignee is the current user', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [roroDataCurrentUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.getByText('Assigned to you')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should render an unclaim button & assignee email if the task status is in progress and the assignee is not the current user', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataOtherUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.getByText('Assigned to notcurrentuser')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should not render a claim or unclaim button, or assignee, if the task status is issued', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataTargetIssued]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData, 'issued')));
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not render a claim or unclaim button, or assignee, if the task status is complete', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataTaskComplete]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData, 'complete')));
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });
});
