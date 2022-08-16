import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../__mocks__/keycloakMock';
import TaskListPage from './TaskListPage';
import { TaskSelectedTabContext } from '../../context/TaskSelectedTabContext';
import { LOCAL_STORAGE_KEYS, TASK_LIST_PATHS } from '../../utils/constants';

import { getLocalStoredItemByKeyValue } from '../../utils/Storage/storageUtil';

// Extend the react-router-dom mock from jest.setup.jsx.
const extendedRouterMock = jest.requireMock('react-router-dom');
extendedRouterMock.useLocation = jest.fn(() => ({ pathname: TASK_LIST_PATHS.AIRPAX[0] }));

describe('TaskListFilters', () => {
  const mockAxios = new MockAdapter(axios);
  const tabData = {
    selectedTabIndex: 1,
    selectTabIndex: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    localStorage.clear();
    mockAxios.reset();
  });

  const setTabAndTaskValues = (value) => {
    return (
      <TaskSelectedTabContext.Provider value={value}>
        <TaskListPage />
      </TaskSelectedTabContext.Provider>
    );
  };

  it('should display filter options based on filter config', async () => {
    await waitFor(() => render(setTabAndTaskValues(tabData)));

    // Titles & Actions
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    expect(screen.getByText('Mode')).toBeInTheDocument();
    expect(screen.getByText('Rule matches (optional)')).toBeInTheDocument();

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Both (0)')).toBeChecked();
  });

  it('should allow user to select a single radio button in each group', async () => {
    await waitFor(() => render(setTabAndTaskValues(tabData)));

    expect(screen.getByLabelText('Both (0)')).toBeChecked();

    userEvent.click(screen.getByLabelText('Has selector (0)'));

    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).toBeChecked();
    expect(screen.getByLabelText('Both (0)')).not.toBeChecked();
  });

  it('should store selection to localstorage when apply filters button is clicked', async () => {
    const EXPECTED_PAYLOAD = {
      mode: 'AIR_PASSENGER',
      selectors: 'ANY',
      movementModes: ['AIR_PASSENGER'],
      rules: [],
      ruleIds: [],
      formStatus: {
        page: 'filter',
      },
    };

    await waitFor(() => render(setTabAndTaskValues(tabData)));

    userEvent.click(screen.getByLabelText('Both (0)'));
    userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)).not.toBeNull();
    expect(getLocalStoredItemByKeyValue(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)).toMatchObject(EXPECTED_PAYLOAD);
  });

  it('should clear filters when clear all filters is clicked', async () => {
    const STORED_FILTERS = {
      mode: 'AIR_PASSENGER',
      selectors: 'ANY',
      movementModes: ['AIR_PASSENGER'],
      rules: [],
      ruleIds: [1234],
      formStatus: {
        page: 'filter',
      },
    };

    await waitFor(() => render(setTabAndTaskValues(tabData)));

    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS, JSON.stringify(STORED_FILTERS));

    expect(getLocalStoredItemByKeyValue(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)).not.toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(getLocalStoredItemByKeyValue(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS)).toBeNull();
  });

  it('should verify post param on applying filter with rules', async () => {
    const STORED_PAYLOAD = {
      mode: 'AIR_PASSENGER',
      selectors: 'ANY',
      movementModes: ['AIR_PASSENGER'],
      rules: [{ id: 1234, name: 'Alpha' }, { id: 5678, name: 'Bravo' }],
      ruleIds: [1234, 5678],
      searchText: null,
      formStatus: {
        page: 'filter',
      },
    };

    const EXPECTED_POST_PARAMS = {
      filterParams: {
        ...STORED_PAYLOAD,
        taskStatuses: [
          'NEW',
        ],
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

    tabData.selectedTabIndex = 0;

    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS, JSON.stringify(STORED_PAYLOAD));

    await waitFor(() => render(setTabAndTaskValues(tabData)));

    userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(JSON.parse(mockAxios.history.post[1].data)).toMatchObject(EXPECTED_POST_PARAMS);
  });

  it('should verify post param ruleIds array when options array id is 0', async () => {
    const STORED_PAYLOAD = {
      mode: 'AIR_PASSENGER',
      selectors: 'ANY',
      movementModes: ['AIR_PASSENGER'],
      rules: [{ id: 0, name: 'Alpha' }, { id: 1, name: 'Bravo' }],
      ruleIds: [0, 1],
      formStatus: {
        page: 'filter',
      },
    };

    const EXPECTED_POST_PARAMS = {
      filterParams: {
        ...STORED_PAYLOAD,
        ruleIds: [0, 1],
        taskStatuses: [
          'NEW',
        ],
        searchText: null,
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

    tabData.selectedTabIndex = 0;

    localStorage.setItem(LOCAL_STORAGE_KEYS.AIRPAX_FILTERS, JSON.stringify(STORED_PAYLOAD));

    await waitFor(() => render(setTabAndTaskValues(tabData)));

    userEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(JSON.parse(mockAxios.history.post[1].data)).toMatchObject(EXPECTED_POST_PARAMS);
  });
});
