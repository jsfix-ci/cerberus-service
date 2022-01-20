import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';
import TaskListPage from '../TaskLists/TaskListPage';
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';

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

  beforeEach(() => {
    render(<TaskSelectedTabContext.Provider value={tabData}><TaskListPage /></TaskSelectedTabContext.Provider>);
  });

  const setTabAndTaskValues = (value, taskStatus = 'inProgress') => {
    return (<TaskSelectedTabContext.Provider value={value}><TaskListPage taskStatus={taskStatus} setError={() => { }} /></TaskSelectedTabContext.Provider>);
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

  it('should display filter options based on filter config (filters.js)', () => {
    // Titles & Actions
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Apply filters')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    expect(screen.getByText('Modes')).toBeInTheDocument();
    expect(screen.getByText('Selectors')).toBeInTheDocument();

    // Check boxes
    expect(screen.getAllByRole('checkbox').length).toBe(3);
    expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByLabelText('Not present (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Present (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Any (0)')).not.toBeChecked();
  });

  it('should allow user to select a single radio button in each group', () => {
    // group one select
    fireEvent.click(screen.getByLabelText('RoRo accompanied freight (0)'));
    // group two select first 'has', then 'has no'
    fireEvent.click(screen.getByLabelText('Present (0)'));
    fireEvent.click(screen.getByLabelText('Not present (0)'));

    expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight (0)')).toBeChecked();
    expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Not present (0)')).toBeChecked();
    expect(screen.getByLabelText('Present (0)')).not.toBeChecked(); // this is reset to 'not' when 'has no' is selected
  });

  it('should store selection to localstorage when apply filters button is clicked', () => {
    fireEvent.click(screen.getByLabelText('RoRo accompanied freight (0)'));
    fireEvent.click(screen.getByLabelText('Present (0)'));
    fireEvent.click(screen.getByText('Apply filters'));

    expect(localStorage.getItem('hasSelector')).toBe('true');
    expect(localStorage.getItem('filterMovementMode')).toBe('RORO_ACCOMPANIED_FREIGHT');
  });

  it('should clear filters when clearAll is clicked', () => {
    localStorage.setItem('hasSelector', 'true');
    localStorage.setItem('filterMovementMode', 'RORO_ACCOMPANIED_FREIGHT');
    expect(localStorage.getItem('hasSelector')).toBe('true');
    expect(localStorage.getItem('filterMovementMode')).toBe('RORO_ACCOMPANIED_FREIGHT');

    fireEvent.click(screen.getByText('Clear all filters'));

    expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Not present (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Present (0)')).not.toBeChecked();
    expect(localStorage.getItem('hasSelector')).toBeFalsy();
    expect(localStorage.getItem('filterMovementMode')).toBeFalsy();
  });

  it('should persist filters when they exist in local storage', () => {
    localStorage.setItem('filterMovementMode', 'RORO_ACCOMPANIED_FREIGHT');

    expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Not present (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Present (0)')).not.toBeChecked();
    expect(localStorage.getItem('filterMovementMode')).toBe('RORO_ACCOMPANIED_FREIGHT');
  });

  it('should render counts for filters and selectors for IN_PROGRESS', async () => {
    mockAxios
      .onPost('/targeting-tasks/status-counts')
      .reply(200, countsFiltersAndSelectorsResponse)
      .onPost('/targeting-tasks/pages')
      .reply(200, []);

    await waitFor(() => render(setTabAndTaskValues(tabData, 'IN_PROGRESS')));
    expect(screen.queryByText('You are not authorised to view these tasks.')).not.toBeInTheDocument();
    expect(screen.getByText('RoRo unaccompanied freight (0)')).toBeInTheDocument();
    expect(screen.getByText('RoRo accompanied freight (0)')).toBeInTheDocument();
    expect(screen.getByText('RoRo Tourist (0)')).toBeInTheDocument();
    expect(screen.getByText('Present (0)')).toBeInTheDocument();
    expect(screen.getByText('Not present (0)')).toBeInTheDocument();
    expect(screen.getByText('Any (0)')).toBeInTheDocument();
  });
});
