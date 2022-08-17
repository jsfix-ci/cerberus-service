import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';

import Filter from './Filter';
import {
  DEFAULT_APPLIED_AIRPAX_FILTER_STATE, DEFAULT_APPLIED_RORO_FILTER_STATE_V2,
  MOVEMENT_MODES,
  TASK_STATUS,
  VIEW,
} from '../../utils/constants';

describe('Filters', () => {
  const APPLIED_FILTERS = [];
  const ON_FILTER_APPLY = (payload) => {
    APPLIED_FILTERS.length = 0;
    APPLIED_FILTERS.push(payload);
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    localStorage.clear();
  });

  it.each([
    [VIEW.AIRPAX, DEFAULT_APPLIED_AIRPAX_FILTER_STATE],
    [VIEW.RORO, DEFAULT_APPLIED_RORO_FILTER_STATE_V2],
  ])('should render the filter based on view', async (view, appliedFilters) => {
    await waitFor(() => render(
      <Filter
        view={view}
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={appliedFilters}
        onApply={jest.fn()}
      />,
    ));

    // Titles & Actions
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText(/Mode/)).toBeInTheDocument();
    expect(screen.getByText('Rule matches (optional)')).toBeInTheDocument();

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Both (0)')).toBeChecked();
  });

  it.each([
    [VIEW.AIRPAX, DEFAULT_APPLIED_AIRPAX_FILTER_STATE],
    [VIEW.RORO, DEFAULT_APPLIED_RORO_FILTER_STATE_V2],
  ])('should allow user to select a single radio button for each view', async (view, appliedFilters) => {
    await waitFor(() => render(
      <Filter
        view={view}
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={appliedFilters}
        onApply={jest.fn()}
      />,
    ));

    expect(screen.getByLabelText('Both (0)')).toBeChecked();

    fireEvent.click(screen.getByLabelText('Has selector (0)'));

    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).toBeChecked();
    expect(screen.getByLabelText('Both (0)')).not.toBeChecked();
  });

  it('should allow user to select a checkbox for the roro v2 view', async () => {
    await waitFor(() => render(
      <Filter
        view={VIEW.RORO}
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULT_APPLIED_RORO_FILTER_STATE_V2}
        onApply={jest.fn()}
      />,
    ));

    expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();

    fireEvent.click(screen.getByLabelText('RoRo accompanied freight (0)'));

    expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight (0)')).toBeChecked();
    expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();
  });

  it.each([
    [VIEW.AIRPAX,
      DEFAULT_APPLIED_AIRPAX_FILTER_STATE, {
        mode: MOVEMENT_MODES.AIR_PASSENGER,
        selectors: 'ANY',
        movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
        searchText: '',
        assignees: [],
        rules: [],
        formStatus: {
          page: 'filter',
        },
      }],
    [VIEW.RORO,
      DEFAULT_APPLIED_RORO_FILTER_STATE_V2, {
        movementModes: [
          MOVEMENT_MODES.ACCOMPANIED_FREIGHT, MOVEMENT_MODES.UNACCOMPANIED_FREIGHT, MOVEMENT_MODES.TOURIST,
        ],
        mode: [],
        selectors: 'ANY',
        ruleIds: [],
        searchText: '',
        assignees: [],
        formStatus: {
          page: 'filter',
        },
      }],
  ])('should verify payload from form', async (view, appliedFilters, expected) => {
    await waitFor(() => render(
      <Filter
        view={view}
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={appliedFilters}
        onApply={ON_FILTER_APPLY}
      />,
    ));

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(APPLIED_FILTERS).toHaveLength(1);
    expect(APPLIED_FILTERS[0]).toMatchObject(expected);
  });
});
