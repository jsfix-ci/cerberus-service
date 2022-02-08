import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';
import TaskListPage from '../TaskLists/TaskListPage';
import taskListData from '../__fixtures__/taskListData.fixture.json';
import taskListDataComplete from '../__fixtures__/taskListData_COMPLETE.fixture.json';
import taskListDataInProgress from '../__fixtures__/taskListData_IN_PROGRESS.fixture.json';
import taskListDataIssued from '../__fixtures__/taskListData_ISSUED.fixture.json';
import taskListDataRoroTouristNoVehicleOnePax from '../__fixtures__/roro-tourist-no-vehicle-single-passenger/taskListData_RoRoTourist.fixture.json';
import taskListDataRoroTouristNoVehicleTwoPax from '../__fixtures__/roro-tourist-no-vehicle-group-passengers/taskListData_RoRoTourist.fixture.json';
import taskListDataRoroTouristVehicleThreePax from '../__fixtures__/roro-tourist-vehicle-3-passengers/taskListData_RoRoTourist.fixture.json';
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';

describe('TaskListPage', () => {
  const mockAxios = new MockAdapter(axios);
  const envUrl = `${window.location.protocol}//${window.location.hostname}`;
  const countResponse = {
    filterParams: {
      movementModes: [],
      hasSelectors: null,
    },
    statusCounts: {
      inProgress: 37,
      issued: 15,
      complete: 19,
      new: 76,
    },
  };

  const countsFiltersAndSelectorsResponse = [
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 6,
        new: 6,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 21,
        new: 21,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: ['RORO_TOURIST'],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 21,
        new: 21,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: [],
        hasSelectors: true,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 38,
        new: 38,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: [],
        hasSelectors: false,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 10,
        new: 10,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: [],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 48,
        new: 48,
      },
    },
  ];

  const countsSelectorsResponse = [
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
        hasSelectors: false,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 0,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
        hasSelectors: false,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 6,
        new: 6,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: ['RORO_TOURIST'],
        hasSelectors: false,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 2,
        new: 2,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: [],
        hasSelectors: true,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 29,
        new: 29,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: [],
        hasSelectors: false,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 8,
        new: 8,
      },
    },
    {
      filterParams: {
        taskStatuses: ['NEW'],
        movementModes: [],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 0,
        issued: 0,
        complete: 0,
        total: 37,
        new: 37,
      },
    },
  ];

  let tabData = {};

  const setTabAndTaskValues = (value, taskStatus = 'new') => {
    return (<TaskSelectedTabContext.Provider value={value}><TaskListPage taskStatus={taskStatus} setError={() => { }} /></TaskSelectedTabContext.Provider>);
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    mockAxios.reset();
    tabData = {
      selectedTabIndex: 0,
      selectTabIndex: jest.fn(),
    };
  });

  it('should render loading spinner on component load', async () => {
    render(setTabAndTaskValues(tabData, 'new'));
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render counts in tab name', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New (76)')).toBeInTheDocument();
    expect(screen.getByText('In progress (37)')).toBeInTheDocument();
    expect(screen.getByText('Issued (15)')).toBeInTheDocument();
    expect(screen.getByText('Complete (19)')).toBeInTheDocument();
  });

  it('should render no more tasks available message when New, In Progress, Target Issued and Complete tabs are clicked and there are no tasks', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [
        {
          filterParams: {
            movementModes: [],
            hasSelectors: null,
          },
          statusCounts: {
            inProgress: 0,
            issued: 0,
            complete: 0,
            new: 0,
          },
        },
      ])
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('New (0)')).toBeInTheDocument();
    expect(screen.getByText('Issued (0)')).toBeInTheDocument();

    expect(screen.getByText('No more tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));
    await waitFor(() => expect(screen.getByText('No more tasks available')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));
    await waitFor(() => expect(screen.getByText('No more tasks available')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));
    await waitFor(() => expect(screen.getByText('No more tasks available')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Request failed with status code 404')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('There is a problem')).not.toBeInTheDocument());
  });

  it('should render each "View details" link per task', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 0, selectTabIndex: jest.fn() }, 'new')));

    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/business:key=a_b_c`));
    await waitFor(() => expect(screen.getAllByText('View details')[1].href).toBe(`${envUrl}/tasks/business:key=d_e_f`));
    await waitFor(() => expect(screen.getAllByText('View details')[2].href).toBe(`${envUrl}/tasks/ghi`));
    await waitFor(() => expect(screen.getAllByText('View details')[3].href).toBe(`${envUrl}/tasks/jkl`));
    await waitFor(() => expect(screen.getAllByText('View details')[4].href).toBe(`${envUrl}/tasks/business:key=m_n_o`));
  });

  it('should render each "View details" link per task for In Progress tab', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataInProgress);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 1, selectTabIndex: jest.fn() }, 'inProgress')));
    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/business:key=d_e_f`));
    await waitFor(() => expect(screen.getAllByText('View details')[1].href).toBe(`${envUrl}/tasks/business:key=d_e_f123`));
    await waitFor(() => expect(screen.getAllByText('View details')[2].href).toBe(`${envUrl}/tasks/business:key=d_e_f234`));
  });

  it('should render each "View details" link per task for Issued tab', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataIssued);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 2, selectTabIndex: jest.fn() }, 'issued')));
    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/ghi`));
  });

  it('should render each "View details" link per task for Completed tab', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataComplete);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 3, selectTabIndex: jest.fn() }, 'completed')));
    await waitFor(() => expect(screen.getAllByText('View details')[0].href).toBe(`${envUrl}/tasks/jkl`));
  });

  it('should render new tasks on page load with a Claim button', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('Claim')).toHaveLength(3);
  });

  it('should render tasks assigned to the current user with an Unclaim button', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataInProgress);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 1, selectTabIndex: jest.fn() }, 'inProgress')));

    fireEvent.click(screen.getByRole('link', { name: /In progress/i }));

    await waitFor(() => expect(screen.queryByText('Claim task')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByText('Assigned to anotheruser')).toHaveLength(1));
  });

  it('should render issued tasks with no claim buttons', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataIssued);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 2, selectTabIndex: jest.fn() }, 'issued')));

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));

    await waitFor(() => expect(screen.getByText('Target issued tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
  });

  it('should render complete tasks with no claim buttons', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataComplete);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 3, selectTabIndex: jest.fn() }, 'complete')));

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));

    await waitFor(() => expect(screen.getByText('Completed tasks')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Claim')).not.toBeInTheDocument());
  });

  it('should display the first risk and a count of risks & handle empty arrays', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 0, selectTabIndex: jest.fn() }, 'new')));

    expect(screen.getAllByText('Local ref')).toHaveLength(1);
    expect(screen.getAllByText('B')).toHaveLength(1);
    expect(screen.getAllByText(/National Security at the Border/i)).toHaveLength(1);
    expect(screen.getAllByText('Paid by Cash')).toHaveLength(1);
    expect(screen.getAllByText('Tier 1')).toHaveLength(1);
    expect(screen.getAllByText(/Class A Drugs/i)).toHaveLength(1);
  });

  it('should display a count and list of targeting indicators', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 0, selectTabIndex: jest.fn() }, 'new')));

    expect(screen.getAllByText('2 indicators')).toHaveLength(1);
    expect(screen.getAllByText('Paid by cash')).toHaveLength(1);
    expect(screen.getAllByText('Late booking tourist (24-72 hours)')).toHaveLength(1);
  });

  it('should calculate total risk score', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 0, selectTabIndex: jest.fn() }, 'new')));

    expect(screen.getAllByText('Risk Score: 25')).toHaveLength(1);
  });

  it('should render updated on task where numberOfVersions is greater than 1', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('Updated')).toHaveLength(1);
  });

  it('should render relisted on task where isRelisted is equal to true', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getAllByText('Relisted')).toHaveLength(1);
  });

  it('should render card for RORO Tourist by vehicle', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristVehicleThreePax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('Driver')).toBeInTheDocument();
    expect(screen.getByText('Vehicle')).toBeInTheDocument();
    expect(screen.queryAllByText('ABCD EFG')).toHaveLength(2);
    expect(screen.queryAllByText('foot passenger')).toHaveLength(0);
    expect(screen.queryAllByText('Group')).toHaveLength(0);
  });

  it('should indicate for RORO Tourist by vehicle when more than 4 passengers has been displayed', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristVehicleThreePax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));
    expect(screen.getAllByText(/plus 1 more/i)).toHaveLength(1);
  });

  it('should render card for RORO Tourist single foot passenger', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristNoVehicleOnePax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('Single passenger')).toBeInTheDocument();
    expect(screen.getByText('Primary traveller')).toBeInTheDocument();
    expect(screen.getByText('1 foot passenger')).toBeInTheDocument();
    expect(screen.getByText('PAX0001')).toBeInTheDocument();
    expect(screen.queryAllByText('Vehicle')).toHaveLength(0);
    expect(screen.getAllByText(/Ben Bailey/i)).toHaveLength(1);
  });

  it('should render card for RORO Tourist group foot passengers', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristNoVehicleTwoPax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('7 foot passengers')).toBeInTheDocument();
    expect(screen.getByText('Primary traveller')).toBeInTheDocument();
    expect(screen.getByText('PAX0001')).toBeInTheDocument();
    expect(screen.getByText('Co-travellers')).toBeInTheDocument();
    expect(screen.queryAllByText('Driver')).toHaveLength(0);
    expect(screen.getAllByText(/plus 2 more/i)).toHaveLength(1);
    expect(screen.getAllByText(/Ben Bailey/i)).toHaveLength(1);
  });

  it('should render card for RORO Tourist group foot passengers and doc numebr for primary traveller only', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristNoVehicleTwoPax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('PAX0001')).toBeInTheDocument();
    expect(screen.queryByText('PAX0002')).not.toBeInTheDocument();
    expect(screen.queryByText('PAX0003')).not.toBeInTheDocument();
    expect(screen.queryByText('PAX0004')).not.toBeInTheDocument();
    expect(screen.queryByText('PAX0005')).not.toBeInTheDocument();
    expect(screen.queryByText('PAX0006')).not.toBeInTheDocument();
    expect(screen.queryByText('PAX0007')).not.toBeInTheDocument();
  });

  it('should not indicate there are more passengers when RORO Tourist group foot passengers are less than 4', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristNoVehicleTwoPax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryAllByText(/plus 1 more/i)).toHaveLength(0);
  });

  it('should handle errors gracefully', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(500, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.getByText('No more tasks available')).toBeInTheDocument();
    expect(screen.queryByText('Request failed with status code 500')).toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });

  it('should render No Show label on task', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataComplete);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 3, selectTabIndex: jest.fn() }, 'complete')));

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));

    await waitFor(() => expect(screen.getByText('No Show')).toBeInTheDocument());
  });

  it('should render Target Withdrawn label on task', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataComplete);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 3, selectTabIndex: jest.fn() }, 'complete')));

    fireEvent.click(screen.getByRole('link', { name: /Complete/i }));

    await waitFor(() => expect(screen.getByText('Target Withdrawn')).toBeInTheDocument());
  });

  it('should not render Target Widthdrawn label on task', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataIssued);

    await waitFor(() => render(setTabAndTaskValues({ selectedTabIndex: 2, selectTabIndex: jest.fn() }, 'issued')));

    fireEvent.click(screen.getByRole('link', { name: /Issued/i }));

    await waitFor(() => expect(screen.queryAllByText('Target Widthrawn')).toHaveLength(0));
  });

  it('should handle count errors gracefully', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(500, [])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListData);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryByText('Request failed with status code 500')).toBeInTheDocument();
    expect(screen.queryByText('There is a problem')).toBeInTheDocument();
  });

  it('should render Unknown for gender when payload field is empty', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, [countResponse])
      .onPost('/targeting-tasks/pages')
      .reply(200, taskListDataRoroTouristVehicleThreePax);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'new')));

    expect(screen.queryAllByText('Unknown')).toHaveLength(1);
  });

  it('should render counts for filters and selectors', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsFiltersAndSelectorsResponse)
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'NEW')));
    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('RoRo unaccompanied freight (6)')).toBeInTheDocument();
    expect(screen.getByText('RoRo accompanied freight (21)')).toBeInTheDocument();
    expect(screen.getByText('RoRo Tourist (21)')).toBeInTheDocument();
    expect(screen.getByText('New (6)')).toBeInTheDocument();
  });

  it('should render counts for a selector only selection', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsSelectorsResponse)
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'NEW')));
    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('RoRo unaccompanied freight (0)')).toBeInTheDocument();
    expect(screen.getByText('RoRo accompanied freight (6)')).toBeInTheDocument();
    expect(screen.getByText('RoRo Tourist (2)')).toBeInTheDocument();
    expect(screen.getByText('Present (29)')).toBeInTheDocument();
    expect(screen.getByText('Not present (8)')).toBeInTheDocument();
    expect(screen.getByText('Any (37)')).toBeInTheDocument();
  });

  it('should select any radio by default', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsSelectorsResponse)
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'NEW')));
    expect(screen.getByLabelText('Present (29)')).not.toBeChecked();
    expect(screen.getByLabelText('Not present (8)')).not.toBeChecked();
    expect(screen.getByText('Any (37)')).toBeInTheDocument();
    expect(screen.getByLabelText('Any (37)')).toBeChecked();
  });
});
