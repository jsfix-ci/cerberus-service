import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { MODE, MOVEMENT_MODES, TASK_STATUS } from '../../../utils/constants';

import Filter from './Filter';

import DEFAULTS from '../../../routes/TaskList/constants';

import filter from '../../../forms/filters';
import { VIEW } from '../../../utils/Common/commonUtil';

describe('Custom.Filter', () => {
  const APPLIED_FILTERS = [];

  const ON_APPLY = (payload) => {
    APPLIED_FILTERS.length = 0;
    APPLIED_FILTERS.push(payload);
  };

  describe('Airpax', () => {
    it('should render the airpax filter', () => {
      render(<Filter
        form={filter('test-user', false, MODE.AIRPAX)}
        taskStatus={TASK_STATUS.NEW}
        handleFilterReset={jest.fn()}
        onApply={jest.fn()}
        data={DEFAULTS[VIEW.AIRPAX].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      // Titles & Actions
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText(/Mode/)).toBeInTheDocument();
      expect(screen.getByText('Search (optional)')).toBeInTheDocument(1);
      expect(screen.getByText('Rule matches (optional)')).toBeInTheDocument(1);
      expect(screen.queryAllByText('Assigned to me (optional)')).toHaveLength(0);

      // Radio buttons
      expect(screen.getAllByRole('radio').length).toBe(3);
      expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Both (0)')).toBeChecked();
    });

    it('should render the assigned to me checkbox', () => {
      render(<Filter
        form={filter('test-user', true, MODE.AIRPAX)}
        taskStatus={TASK_STATUS.IN_PROGRESS}
        handleFilterReset={jest.fn()}
        onApply={jest.fn()}
        data={DEFAULTS[VIEW.AIRPAX].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      // Titles & Actions
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText(/Mode/)).toBeInTheDocument();
      expect(screen.getByText('Rule matches (optional)')).toBeInTheDocument(1);
      expect(screen.queryAllByText('Assigned to me (optional)')).toHaveLength(1);

      // Radio buttons
      expect(screen.getAllByRole('radio').length).toBe(3);
      expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Both (0)')).toBeChecked();
    });

    it('should select a single radio', async () => {
      render(<Filter
        form={filter('test-user', false, MODE.AIRPAX)}
        taskStatus={TASK_STATUS.NEW}
        handleFilterReset={jest.fn()}
        onApply={jest.fn()}
        data={DEFAULTS[VIEW.AIRPAX].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      expect(screen.getByLabelText('Both (0)')).toBeChecked();

      fireEvent.click(screen.getByLabelText('Has selector (0)'));

      expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Has selector (0)')).toBeChecked();
      expect(screen.getByLabelText('Both (0)')).not.toBeChecked();
    });

    it('should verify payload from filter', async () => {
      const EXPECTED = {
        mode: MOVEMENT_MODES.AIR_PASSENGER,
        selectors: 'ANY',
        movementModes: [MOVEMENT_MODES.AIR_PASSENGER],
        searchText: '',
        assignees: [],
        rules: [],
      };

      render(<Filter
        form={filter('test-user', false, MODE.AIRPAX)}
        taskStatus={TASK_STATUS.NEW}
        handleFilterReset={jest.fn()}
        onApply={ON_APPLY}
        data={DEFAULTS[VIEW.AIRPAX].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

      expect(APPLIED_FILTERS).toHaveLength(1);
      expect(APPLIED_FILTERS[0]).toMatchObject(EXPECTED);
    });
  });

  describe('RoRo', () => {
    it('should render the roro filter', () => {
      render(<Filter
        form={filter('test-user', false, MODE.RORO)}
        taskStatus={TASK_STATUS.NEW}
        handleFilterReset={jest.fn()}
        onApply={jest.fn()}
        data={DEFAULTS[VIEW.RORO_V2].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      // Titles & Actions
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText(/Mode/)).toBeInTheDocument();
      expect(screen.getByText('Search (optional)')).toBeInTheDocument();
      expect(screen.getByText('RoRo unaccompanied freight (0)')).toBeInTheDocument();
      expect(screen.getByText('RoRo accompanied freight (0)')).toBeInTheDocument();
      expect(screen.getByText('RoRo Tourist (0)')).toBeInTheDocument();
      expect(screen.queryAllByText('Assigned to me (optional)')).toHaveLength(0);

      // Radio buttons
      expect(screen.getAllByRole('radio').length).toBe(3);
      expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Both (0)')).toBeChecked();
    });

    it('should render the assigned to me checkbox', () => {
      render(<Filter
        form={filter('test-user', true, MODE.RORO)}
        taskStatus={TASK_STATUS.IN_PROGRESS}
        handleFilterReset={jest.fn()}
        onApply={jest.fn()}
        data={DEFAULTS[VIEW.RORO_V2].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      // Titles & Actions
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText(/Mode/)).toBeInTheDocument();
      expect(screen.getByText('Search (optional)')).toBeInTheDocument();
      expect(screen.getByText('RoRo unaccompanied freight (0)')).toBeInTheDocument();
      expect(screen.getByText('RoRo accompanied freight (0)')).toBeInTheDocument();
      expect(screen.getByText('RoRo Tourist (0)')).toBeInTheDocument();
      expect(screen.queryAllByText('Assigned to me (optional)')).toHaveLength(1);

      // Radio buttons
      expect(screen.getAllByRole('radio').length).toBe(3);
      expect(screen.getByLabelText('Has no selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Has selector (0)')).not.toBeChecked();
      expect(screen.getByLabelText('Both (0)')).toBeChecked();
    });

    it('should select a checkbox', async () => {
      render(<Filter
        form={filter('test-user', false, MODE.RORO)}
        taskStatus={TASK_STATUS.NEW}
        handleFilterReset={jest.fn()}
        onApply={jest.fn()}
        data={DEFAULTS[VIEW.RORO_V2].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
      expect(screen.getByLabelText('RoRo accompanied freight (0)')).not.toBeChecked();
      expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();

      fireEvent.click(screen.getByLabelText('RoRo accompanied freight (0)'));

      expect(screen.getByLabelText('RoRo unaccompanied freight (0)')).not.toBeChecked();
      expect(screen.getByLabelText('RoRo accompanied freight (0)')).toBeChecked();
      expect(screen.getByLabelText('RoRo Tourist (0)')).not.toBeChecked();
    });

    it('should verify payload from filter', async () => {
      const EXPECTED = {
        movementModes: [
          MOVEMENT_MODES.ACCOMPANIED_FREIGHT,
          MOVEMENT_MODES.UNACCOMPANIED_FREIGHT,
          MOVEMENT_MODES.TOURIST,
        ],
        mode: [],
        selectors: 'ANY',
        ruleIds: [],
        searchText: '',
        assignees: [],
        assignedToMe: [],
        movementDirection: ['ANY'],
      };

      const EXPECTED_KEYS = Object.keys(EXPECTED);

      render(<Filter
        form={filter('test-user', false, MODE.RORO)}
        taskStatus={TASK_STATUS.NEW}
        handleFilterReset={jest.fn()}
        onApply={ON_APPLY}
        data={DEFAULTS[VIEW.RORO_V2].filters.default}
        customOptions={{}}
        filtersAndSelectorsCount={{}}
      />);

      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

      expect(APPLIED_FILTERS).toHaveLength(1);
      expect(APPLIED_FILTERS[0]).toMatchObject(EXPECTED);
      expect(Object.keys(APPLIED_FILTERS[0]).every((k) => EXPECTED_KEYS.includes(k))).toBeTruthy();
    });
  });
});
