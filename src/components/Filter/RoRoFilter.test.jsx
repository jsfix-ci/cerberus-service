import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '../../__mocks__/keycloakMock';

import RoRoFilter from './RoRoFilter';
import { MOVEMENT_MODES,
  TASK_STATUS } from '../../utils/constants';

import DEFAULTS from '../../routes/TaskList/constants';
import { VIEW } from '../../utils/Common/commonUtil';

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
      <RoRoFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULTS[VIEW.RORO_V2].filters.default}
        onApply={jest.fn()}
      />,
    ));

    // Titles & Actions
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText(/Mode/)).toBeInTheDocument();
    expect(screen.queryAllByText('Rule matches (optional)')).toHaveLength(0);

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Both (0)')).toBeChecked();
  });

  it('should select a single radio button', async () => {
    await waitFor(() => render(
      <RoRoFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULTS[VIEW.RORO_V2].filters.default}
        onApply={jest.fn()}
      />,
    ));

    expect(screen.getByLabelText('Both (0)')).toBeChecked();

    fireEvent.click(screen.getByLabelText('Has selector (0)'));

    expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector (0)')).toBeChecked();
    expect(screen.getByLabelText('Both (0)')).not.toBeChecked();
  });

  it('should select a checkbox', async () => {
    await waitFor(() => render(
      <RoRoFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULTS[VIEW.RORO_V2].filters.default}
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

  it('should verify payload from filter form', async () => {
    const EXPECTED = {
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
    };
    await waitFor(() => render(
      <RoRoFilter
        taskStatus={TASK_STATUS.NEW}
        appliedFilters={DEFAULTS[VIEW.RORO_V2].filters.default}
        onApply={ON_FILTER_APPLY}
      />,
    ));

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    expect(APPLIED_FILTERS).toHaveLength(1);
    expect(APPLIED_FILTERS[0]).toMatchObject(EXPECTED);
  });
});
