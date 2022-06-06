import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../../__mocks__/keycloakMock';
import TaskListPage from '../TaskLists/TaskListPage';
import { TaskSelectedTabContext } from '../../../context/TaskSelectedTabContext';
import { FILTERS_KEY } from '../../../constants';

describe('TaskListFilters', () => {
  const mockAxios = new MockAdapter(axios);
  const tabData = {
    selectedTabIndex: 1,
    selectTabIndex: jest.fn(),
  };
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.clearAllMocks();
    localStorage.clear();
    mockAxios.reset();
  });

  const setTabAndTaskValues = (value, taskStatus = 'inProgress') => {
    return (
      <TaskSelectedTabContext.Provider value={value}>
        <TaskListPage taskStatus={taskStatus} setError={() => { }} />
      </TaskSelectedTabContext.Provider>
    );
  };

  const countsFiltersAndSelectorsResponse = [
    {
      filterParams: {
        taskStatuses: ['IN_PROGRESS'],
        movementModes: ['RORO_UNACCOMPANIED_FREIGHT'],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 5,
        issued: 0,
        complete: 0,
        total: 5,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: ['IN_PROGRESS'],
        movementModes: ['RORO_ACCOMPANIED_FREIGHT'],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 9,
        issued: 0,
        complete: 0,
        total: 9,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: ['IN_PROGRESS'],
        movementModes: ['RORO_TOURIST'],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 3,
        issued: 0,
        complete: 0,
        total: 3,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: ['IN_PROGRESS'],
        movementModes: [],
        hasSelectors: true,
      },
      statusCounts: {
        inProgress: 15,
        issued: 0,
        complete: 0,
        total: 15,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: ['IN_PROGRESS'],
        movementModes: [],
        hasSelectors: false,
      },
      statusCounts: {
        inProgress: 2,
        issued: 0,
        complete: 0,
        total: 2,
        new: 0,
      },
    },
    {
      filterParams: {
        taskStatuses: ['IN_PROGRESS'],
        movementModes: [],
        hasSelectors: null,
      },
      statusCounts: {
        inProgress: 17,
        issued: 0,
        complete: 0,
        total: 17,
        new: 0,
      },
    },
  ];

  it('should display filter options based on filter config', async () => {
    await waitFor(() => render(
      <TaskSelectedTabContext.Provider value={tabData}>
        <TaskListPage />
      </TaskSelectedTabContext.Provider>,
    ));

    // Titles & Actions
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    expect(screen.getByText('Mode')).toBeInTheDocument();

    userEvent.selectOptions(screen.getByRole('combobox', { target: { name: 'Mode' } }), 'RORO_UNACCOMPANIED_FREIGHT');

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Both (0)')).toBeChecked();
  });

  it('should allow user to select a single radio button in each group', async () => {
    await waitFor(() => render(
      <TaskSelectedTabContext.Provider value={tabData}>
        <TaskListPage />
      </TaskSelectedTabContext.Provider>,
    ));

    userEvent.selectOptions(screen.getByRole('combobox', { target: { name: 'Mode' } }), 'RORO_UNACCOMPANIED_FREIGHT');

    expect(screen.getByLabelText('Both (0)')).toBeChecked();

    userEvent.click(screen.getByLabelText('Has selector (0)'));

    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).toBeChecked();
    expect(screen.getByLabelText('Both (0)')).not.toBeChecked();
  });

  it('should store selection to localstorage when apply filters button is clicked', async () => {
    const expected = {
      mode: 'RORO_UNACCOMPANIED_FREIGHT',
      formStatus: {
        page: 'filter',
      },
    };

    await waitFor(() => render(
      <TaskSelectedTabContext.Provider value={tabData}>
        <TaskListPage />
      </TaskSelectedTabContext.Provider>,
    ));

    userEvent.selectOptions(screen.getByRole('combobox', { target: { name: 'Mode' } }), 'RORO_UNACCOMPANIED_FREIGHT');

    userEvent.click(screen.getByLabelText('Both (0)'));
    userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(localStorage.getItem(FILTERS_KEY)).not.toBeNull();
    expect(JSON.parse(localStorage.getItem(FILTERS_KEY))).toMatchObject(expected);
  });

  it('should clear filters when clearAll is clicked', async () => {
    const STORED_FILTERS = {
      mode: 'RORO_UNACCOMPANIED_FREIGHT',
      formStatus: {
        page: 'filter',
      },
    };

    await waitFor(() => render(
      <TaskSelectedTabContext.Provider value={tabData}>
        <TaskListPage />
      </TaskSelectedTabContext.Provider>,
    ));

    localStorage.setItem(FILTERS_KEY, STORED_FILTERS);

    expect(localStorage.getItem(FILTERS_KEY)).not.toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(localStorage.getItem(FILTERS_KEY)).toBeNull();
  });

  it('should render counts for filters and selectors for IN_PROGRESS', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsFiltersAndSelectorsResponse)
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'IN_PROGRESS')));

    userEvent.selectOptions(screen.getByRole('combobox', { target: { name: 'Mode' } }), 'RORO_ACCOMPANIED_FREIGHT');

    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('RoRo unaccompanied freight (0)')).toBeInTheDocument();
    expect(screen.getByText('RoRo accompanied freight (0)')).toBeInTheDocument();
    expect(screen.getByText('RoRo Tourist (0)')).toBeInTheDocument();
    expect(screen.getByText('Has selector (0)')).toBeInTheDocument();
    expect(screen.getByText('Has no selector (0)')).toBeInTheDocument();
    expect(screen.getByText('Both (0)')).toBeInTheDocument();
  });
});
