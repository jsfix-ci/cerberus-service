import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';

import AirpaxFilter from './AirpaxFilter';
import {
  MOVEMENT_MODES,
  TASK_STATUS,
} from '../../utils/constants';

import { DEFAULT_APPLIED_AIRPAX_FILTER_STATE } from '../../routes/TaskList/airpax/TaskListPage';

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

  it('should render the filter', async () => {
    await waitFor(() => render(
      <AirpaxFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULT_APPLIED_AIRPAX_FILTER_STATE}
        onApply={jest.fn()}
      />,
    ));

    // Titles & Actions
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText(/Mode/)).toBeInTheDocument();
    expect(screen.getByText('Rule matches (optional)')).toBeInTheDocument(1);

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Both (0)')).toBeChecked();
  });

  it('should select a single radio', async () => {
    await waitFor(() => render(
      <AirpaxFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULT_APPLIED_AIRPAX_FILTER_STATE}
        onApply={jest.fn()}
      />,
    ));

    expect(screen.getByLabelText('Both (0)')).toBeChecked();

    fireEvent.click(screen.getByLabelText('Has selector (0)'));

    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).toBeChecked();
    expect(screen.getByLabelText('Both (0)')).not.toBeChecked();
  });

  it('should verify payload from form', async () => {
    const EXPECTED = {
      mode: MOVEMENT_MODES.AIR_PASSENGER,
      selectors: 'ANY',
      movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
      searchText: '',
      assignees: [],
      rules: [],
      formStatus: {
        page: 'filter',
      },
    };

    await waitFor(() => render(
      <AirpaxFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULT_APPLIED_AIRPAX_FILTER_STATE}
        onApply={ON_FILTER_APPLY}
      />,
    ));

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(APPLIED_FILTERS).toHaveLength(1);
    expect(APPLIED_FILTERS[0]).toMatchObject(EXPECTED);
  });
});
