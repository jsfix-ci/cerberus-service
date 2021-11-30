import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, screen } from '@testing-library/react';
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
    localStorage.removeItem('filters');
    mockAxios.reset();
  });

  beforeEach(() => {
    render(<TaskSelectedTabContext.Provider value={tabData}><TaskListPage /></TaskSelectedTabContext.Provider>);
  });

  it('should display filter options based on filter config (filters.js)', async () => {
    // Titles & Actions
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Apply filters')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    expect(screen.getByText('Mode')).toBeInTheDocument();
    expect(screen.getByText('Selectors')).toBeInTheDocument();

    // Radio buttons
    expect(screen.getAllByRole('radio').length).toBe(6);
    expect(screen.getByLabelText('RoRo unaccompanied freight')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo tourist')).not.toBeChecked();
    expect(screen.getByLabelText('Has no selector')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector')).not.toBeChecked();
  });

  it('should allow user to select a single radio button in each group', async () => {
    // group one select
    fireEvent.click(screen.getByLabelText('RoRo accompanied freight'));
    // group two select first 'has', then 'has no'
    fireEvent.click(screen.getByLabelText('Has selector'));
    fireEvent.click(screen.getByLabelText('Has no selector'));

    expect(screen.getByLabelText('RoRo unaccompanied freight')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight')).toBeChecked();
    expect(screen.getByLabelText('RoRo tourist')).not.toBeChecked();
    expect(screen.getByLabelText('Has no selector')).toBeChecked();
    expect(screen.getByLabelText('Has selector')).not.toBeChecked(); // this is reset to 'not' when 'has no' is selected
  });

  it('should store selection to localstorage when apply filters button is clicked', async () => {
    fireEvent.click(screen.getByLabelText('RoRo accompanied freight'));
    fireEvent.click(screen.getByLabelText('Has selector'));
    fireEvent.click(screen.getByText('Apply filters'));

    expect(localStorage.getItem('filters')).toBe('movementMode_eq_roro-accompanied-freight,hasSelectors_eq_yes');
  });

  it('should clear filters when clearAll is clicked', async () => {
    localStorage.setItem('filters', 'movementMode_eq_roro-accompanied-freight,hasSelectors_eq_yes');

    fireEvent.click(screen.getByText('Clear all filters'));

    expect(screen.getByLabelText('RoRo unaccompanied freight')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo accompanied freight')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo tourist')).not.toBeChecked();
    expect(screen.getByLabelText('Has no selector')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector')).not.toBeChecked();
    expect(localStorage.getItem('filters')).toBeFalsy();
  });

  it('should persist filters when they exist in local storage', async () => {
    localStorage.setItem('filters', 'movementMode_eq_roro-accompanied-freight');

    expect(screen.getByLabelText('RoRo unaccompanied freight')).not.toBeChecked();
    expect(screen.getByLabelText('RoRo tourist')).not.toBeChecked();
    expect(screen.getByLabelText('Has no selector')).not.toBeChecked();
    expect(screen.getByLabelText('Has selector')).not.toBeChecked();
    expect(localStorage.getItem('filters')).toBe('movementMode_eq_roro-accompanied-freight');
  });
});
