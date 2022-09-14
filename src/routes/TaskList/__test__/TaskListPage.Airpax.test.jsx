import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';

// Components/Pages
import { ApplicationContext } from '../../../context/ApplicationContext';
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';
import { PnrAccessContext } from '../../../context/PnrAccessContext';
import { ViewContext } from '../../../context/ViewContext';

import TaskListPage from '../TaskListPage';

import { LOCAL_STORAGE_KEYS, PATHS, TASK_STATUS } from '../../../utils/constants';
import { VIEW } from '../../../utils/Common/commonUtil';

// Fixture
import dataCurrentUser from '../../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../../../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../../../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import dataTargetIssued from '../../../__fixtures__/taskData_AirPax_TargetIssued.fixtures.json';
import dataTaskComplete from '../../../__fixtures__/taskData_AirPax_TaskComplete.fixture.json';
import refDataAirlineCodes from '../../../__fixtures__/taskData_Airpax_AirlineCodes.json';

describe('Airpax.TaskListPage', () => {
  // Extend the react-router-dom mock from jest.setup.jsx.
  const extendedRouterMock = jest.requireMock('react-router-dom');
  extendedRouterMock.useLocation = jest.fn(() => ({ pathname: PATHS.AIRPAX }));

  const mockAxios = new MockAdapter(axios);

  let defaultPostPagesParams;

  let tabData = {};

  let pnrData = {};

  const countsFiltersAndSelectorsResponse = [
    {
      filterParams: {
        taskStatuses: [
          'NEW',
        ],
        movementModes: [
          'AIR_PASSENGER',
        ],
        departureStatuses: null,
        selectors: 'ANY',
        ruleIds: null,
        searchText: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        new: 2,
      },
    },
    {
      filterParams: {
        taskStatuses: [
          'NEW',
        ],
        movementModes: [
          'AIR_PASSENGER',
        ],
        departureStatuses: null,
        selectors: 'PRESENT',
        ruleIds: null,
        searchText: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: [
          'NEW',
        ],
        movementModes: [
          'AIR_PASSENGER',
        ],
        departureStatuses: null,
        selectors: 'NOT_PRESENT',
        ruleIds: null,
        searchText: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        new: 2,
      },
    },
    {
      filterParams: {
        taskStatuses: [
          'NEW',
        ],
        movementModes: [
          'AIR_PASSENGER',
        ],
        departureStatuses: null,
        selectors: 'ANY',
        ruleIds: null,
        searchText: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        new: 2,
      },
    },
  ];

  const EXPECTED_POST_PARAM = [{
    mode: 'AIR_PASSENGER',
    movementModes: ['AIR_PASSENGER'],
    selectors: 'ANY',
  }];

  const MockApplicationContext = ({ children }) => (
    <ApplicationContext.Provider value={{ refDataAirlineCodes: jest.fn().mockReturnValue(refDataAirlineCodes) }}>
      {children}
    </ApplicationContext.Provider>
  );

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    tabData = {
      taskManagementTabIndex: 0,
      selectTaskManagementTabIndex: jest.fn(),
    };

    pnrData = {
      canViewPnrData: true,
      setViewPnrData: jest.fn(),
    };

    mockAxios.reset();

    defaultPostPagesParams = {
      filterParams: {
        taskStatuses: [],
        movementModes: ['AIR_PASSENGER'],
        selectors: 'ANY',
      },
      sortParams: [
        {
          field: 'WINDOW_OF_OPPORTUNITY',
          order: 'ASC',
        },
        {
          field: 'BOOKING_LEAD_TIME',
          order: 'ASC',
        },
      ],
      pageParams: {
        limit: 100,
        offset: 0,
      },
    };
  });

  const setTabAndTaskValues = (tabValue, pnrValue) => {
    return (
      <MockApplicationContext>
        <ViewContext.Provider value={{ getView: jest.fn().mockReturnValue(VIEW.AIRPAX), setView: jest.fn() }}>
          <PnrAccessContext.Provider value={pnrValue}>
            <TaskSelectedTabContext.Provider value={tabValue}>
              <TaskListPage />
            </TaskSelectedTabContext.Provider>
          </PnrAccessContext.Provider>
        </ViewContext.Provider>
      </MockApplicationContext>
    );
  };

  it('should render a message related to the tab clicked, on click', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID,
      JSON.stringify({ sessionId: '123-456', requested: true }));
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [])
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsFiltersAndSelectorsResponse)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: [] })
      .onGet('/filters/rules')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New tasks')).toBeInTheDocument();
    expect(screen.getByText(/Task management \(AirPax\)/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('There are no new tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));
    expect(screen.getByText('Target issued tasks')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('There are no issued tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    await waitFor(() => expect(screen.getByText('There are no in progress tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    await waitFor(() => expect(screen.getByText('There are no complete tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());
  });

  it('should not show Assigned to me checkbox for new, issued and completed tabs', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataCurrentUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(0);

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(0);

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(0);

    fireEvent.click(screen.getByRole('link', { name: /New/i }));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(0);
  });

  it('should show Assigned to me checkbox when In Progress tab is clicked', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataCurrentUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(0);

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(1);

    fireEvent.click(screen.getByRole('link', { name: /New/i }));
    expect(screen.queryAllByText('Assigned to me')).toHaveLength(0);
  });

  it('should render a target task on the task list page', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataCurrentUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(screen.getByText('Single passenger')).toBeInTheDocument();
    expect(screen.getByText('DC')).toBeInTheDocument();
    expect(screen.getByText('British Airways, flight BA103, Unknown')).toBeInTheDocument();
    expect(screen.getByText('BA103')).toBeInTheDocument();
    expect(screen.getByText(/7 Aug 2020/)).toBeInTheDocument();
    expect(screen.getAllByText(/FRA/)).toHaveLength(2);
    expect(screen.getAllByText('LHR')).toHaveLength(2);

    expect(screen.getAllByText(/Passenger/i)).toHaveLength(4);
    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByText('Co-travellers')).toBeInTheDocument();
    expect(screen.getByText('Route')).toBeInTheDocument();

    expect(screen.getByText(/FORD/)).toBeInTheDocument();
    expect(screen.getByText(/Isaiah/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();
    expect(screen.getByText(/13 May 1966/)).toBeInTheDocument();
    expect(screen.getByText('Route')).toBeInTheDocument();
    expect(screen.getByText(/1 checked bag/)).toBeInTheDocument();
    expect(screen.getByText(/Valid from Unknown/)).toBeInTheDocument();
    expect(screen.getByText(/Expires Unknown/)).toBeInTheDocument();
    expect(screen.getByText(/Issued by Unknown/)).toBeInTheDocument();
  });

  it('should fetch tasks using default params', async () => {
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS.NEW.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages', defaultPostPagesParams)
      .reply(200, [dataCurrentUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

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
      .reply(200, [dataCurrentUser]);

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

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not render a claim or unclaim button, or assignee, if the task status is complete', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataTaskComplete]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should contain the expect post params for new tab', async () => {
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS.NEW.toUpperCase()];
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should contain the expect post params for in_progress tab', async () => {
    const PARAM_IN_PROGRESS = 'IN_PROGRESS';
    tabData.taskManagementTabIndex = 1;
    defaultPostPagesParams.filterParams.taskStatuses = [PARAM_IN_PROGRESS];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should contain the expect post params for issued tab', async () => {
    tabData.taskManagementTabIndex = 2;
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS.ISSUED.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should contain the expect post params for completed tab', async () => {
    tabData.taskManagementTabIndex = 3;
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS.COMPLETE.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should render button to request PNR access when has no access to PNR data across tabs', async () => {
    pnrData.canViewPnrData = false;
    localStorage.setItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID, JSON.stringify({ sessionId: '123-456', requested: false }));
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS.NEW.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(403, dataNoAssignee);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(screen.getByText(/You do not have access to view new PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view new PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to new PNR data/)).toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'In progress (0)' })));

    expect(screen.getByText(/You do not have access to view in progress PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view in progress PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to in progress PNR data/)).toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'Issued (0)' })));

    expect(screen.getByText(/You do not have access to view issued PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view issued PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to issued PNR data/)).toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'Complete (0)' })));
    expect(screen.getByText(/You do not have access to view complete PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view complete PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to complete PNR data/)).toBeInTheDocument();
  });

  it('should render button to request PNR access when user has no access to PNR data and api returns an empty tasks array', async () => {
    pnrData.canViewPnrData = false;
    localStorage.setItem(LOCAL_STORAGE_KEYS.PNR_USER_SESSION_ID, JSON.stringify({ sessionId: '123-456', requested: false }));
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS.IN_PROGRESS.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(403, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));

    expect(screen.getByText(/You do not have access to view new PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view new PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to new PNR data/)).toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'In progress (0)' })));

    expect(screen.getByText(/You do not have access to view in progress PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view in progress PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to in progress PNR data/)).toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'Issued (0)' })));

    expect(screen.getByText(/You do not have access to view issued PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view issued PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to issued PNR data/)).toBeInTheDocument();

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'Complete (0)' })));
    expect(screen.getByText(/You do not have access to view complete PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view complete PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to complete PNR data/)).toBeInTheDocument();
  });

  it('should show flight status filters on AirPax mode', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataCurrentUser]);

    await waitFor(() => render(setTabAndTaskValues(tabData, pnrData)));
    expect(screen.getByText(/Flight status/)).toBeInTheDocument();
  });
});
