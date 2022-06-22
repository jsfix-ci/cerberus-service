import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../../__mocks__/keycloakMock';
// Components/Pages
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';
import TaskListPage from '../TaskLists/TaskListPage';

import { TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED } from '../../../constants';

// Fixture
import dataCurrentUser from '../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import dataOtherUser from '../__fixtures__/taskData_AirPax_AssigneeOtherUser.fixture.json';
import dataNoAssignee from '../__fixtures__/taskData_AirPax_NoAssignee.fixture.json';
import dataTargetIssued from '../__fixtures__/taskData_AirPax_TargetIssued.fixtures.json';
import dataTaskComplete from '../__fixtures__/taskData_AirPax_TaskComplete.fixture.json';
import airlineCodes from '../__fixtures__/taskData_Airpax_AirlineCodes.json';

describe('TaskListPage', () => {
  const mockAxios = new MockAdapter(axios);

  let defaultPostPagesParams;

  let tabData = {};

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

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    tabData = {
      selectedTabIndex: 0,
      selectTabIndex: jest.fn(),
      selectTaskManagementTabIndex: jest.fn(),
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

  const setTabAndTaskValues = (value, taskStatus = 'new') => {
    return (
      <TaskSelectedTabContext.Provider value={value}>
        <TaskListPage taskStatus={taskStatus} />
      </TaskSelectedTabContext.Provider>
    );
  };

  it('should render a message related to the tab clicked, on click', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [])
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsFiltersAndSelectorsResponse)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: [] })
      .onGet('/filters/rules')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

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

  it('should render a target task on the task list page', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataCurrentUser])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('Single passenger')).toBeInTheDocument();
    expect(screen.getByText('DC')).toBeInTheDocument();
    expect(screen.getByText('British Airways, flight BA103, arrival Unknown')).toBeInTheDocument();
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
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS_NEW.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages', defaultPostPagesParams)
      .reply(200, [dataCurrentUser])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should render a claim button if the task status is new & there is no assignee', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataNoAssignee])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));
    expect(screen.getByText('Claim')).toBeInTheDocument();
  });

  it('should render an unclaim button & assigned to you if the task status is in progress and the assignee is the current user', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataCurrentUser])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'inProgress')));
    expect(screen.getByText('Assigned to you')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should render an unclaim button & assignee email if the task status is in progress and the assignee is not the current user', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataOtherUser])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'inProgress')));
    expect(screen.getByText('Assigned to notcurrentuser')).toBeInTheDocument();
    expect(screen.getByText('Unclaim task')).toBeInTheDocument();
  });

  it('should not render a claim or unclaim button, or assignee, if the task status is issued', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataTargetIssued])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'issued')));
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should not render a claim or unclaim button, or assignee, if the task status is complete', async () => {
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [dataTaskComplete])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, 'complete')));
    expect(screen.queryByText('Assigned to you')).not.toBeInTheDocument();
    expect(screen.queryByText('Assigned to notcurrentuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Unclaim task')).not.toBeInTheDocument();
  });

  it('should contain the expect post params for new tab', async () => {
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS_NEW.toUpperCase()];
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, TASK_STATUS_NEW)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should contain the expect post params for in_progress tab', async () => {
    const PARAM_IN_PROGRESS = 'IN_PROGRESS';
    tabData.selectedTabIndex = 1;
    defaultPostPagesParams.filterParams.taskStatuses = [PARAM_IN_PROGRESS];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, TASK_STATUS_IN_PROGRESS)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should contain the expect post params for issued tab', async () => {
    tabData.selectedTabIndex = 2;
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS_TARGET_ISSUED.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, TASK_STATUS_TARGET_ISSUED)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should contain the expect post params for completed tab', async () => {
    tabData.selectedTabIndex = 3;
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS_COMPLETED.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(200, [])
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, TASK_STATUS_COMPLETED)));

    expect(JSON.parse(mockAxios.history.post[0].data)).toMatchObject(EXPECTED_POST_PARAM);
  });

  it('should render the button to request PNR access when the user does not have access to PNR data (new tab)', async () => {
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS_NEW.toUpperCase()];
    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(403, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, TASK_STATUS_NEW)));

    expect(screen.getByText(/You do not have access to view new PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view new PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to new PNR data/)).toBeInTheDocument();
  });

  it('should render the button to request PNR access when the user does not have access to PNR data (in progress tab)', async () => {
    defaultPostPagesParams.filterParams.taskStatuses = [TASK_STATUS_IN_PROGRESS.toUpperCase()];

    mockAxios
      .onPost('/targeting-tasks/pages')
      .reply(403, dataNoAssignee)
      .onGet('/v2/entities/carrierlist')
      .reply(200, { data: airlineCodes });

    await waitFor(() => render(setTabAndTaskValues(tabData, TASK_STATUS_IN_PROGRESS)));

    await waitFor(() => fireEvent.click(screen.getByRole('link', { name: 'In progress (0)' })));

    expect(screen.getByText(/You do not have access to view in progress PNR data/)).toBeInTheDocument();
    expect(screen.getByText(/To view in progress PNR data, you will need to request access/)).toBeInTheDocument();
    expect(screen.getByText(/Request access to in progress PNR data/)).toBeInTheDocument();
  });
});
