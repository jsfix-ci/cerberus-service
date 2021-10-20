import React from 'react';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import TaskListFilters from '../TaskLists/TaskListFilters';

describe('TaskListFilters', () => {
  const applyFilters = jest.fn();
  const clearFilters = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem('filtersSelected');
  });

  const filterName = 'Filters name';
  const filterList = [
    {
      name: 'item-one',
      code: 'item-one',
      label: 'Item one',
      checked: false,
    },
    {
      name: 'item-two',
      code: 'item-two',
      label: 'Item two',
      checked: false,
    },
    {
      name: 'item-three',
      code: 'item-three',
      label: 'Item three',
      checked: false,
    },
  ];

  it('should display select filter if type is select', async () => {
    const filterType = 'filterTypeSelect';
    render(<TaskListFilters
      filterList={filterList}
      filterName={filterName}
      filterType={filterType}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
    />);
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Apply filters')).toBeInTheDocument();
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
    expect(screen.getAllByText('Select filter')).toHaveLength(2);

    expect(screen.getAllByRole('combobox').length).toBe(1);
    expect(screen.getByRole('option', { name: 'Select filter' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Item one' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item two' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item three' }).selected).toBe(false);
    expect(screen.getAllByRole('option').length).toBe(4);
  });

  it('should allow user to change selection in select box', async () => {
    const filterType = 'filterTypeSelect';
    const { container } = render(
      <TaskListFilters
        filterList={filterList}
        filterName={filterName}
        filterType={filterType}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />,
    );

    const dropDown = getByTestId(container, 'target-filter-select');
    fireEvent.change(dropDown, { target: { value: 'item-two' } });
    expect(screen.getByRole('option', { name: 'Select filter' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item one' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item two' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Item three' }).selected).toBe(false);
    expect(localStorage.getItem('filtersSelected')).toBe('item-two');
  });

  it('should applyFilters when apply filters button is clicked', async () => {
    const filterType = 'filterTypeSelect';
    const { container } = render(
      <TaskListFilters
        filterList={filterList}
        filterName={filterName}
        filterType={filterType}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />,
    );

    const dropDown = getByTestId(container, 'target-filter-select');
    fireEvent.change(dropDown, { target: { value: 'item-two' } });
    fireEvent.click(screen.getByText('Apply filters'));

    expect(applyFilters.mock.calls.length).toBe(1);
  });

  it('should clear filters when clearAll is clicked', async () => {
    localStorage.setItem('filtersSelected', 'item-three');
    const filterType = 'filterTypeSelect';
    render(
      <TaskListFilters
        filterList={filterList}
        filterName={filterName}
        filterType={filterType}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />,
    );

    fireEvent.click(screen.getByText('Clear filters'));

    expect(clearFilters.mock.calls.length).toBe(1);
    expect(screen.getByRole('option', { name: 'Select filter' }).selected).toBe(true);
    expect(screen.getByRole('option', { name: 'Item one' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item two' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item three' }).selected).toBe(false);
    expect(localStorage.getItem('filtersSelected')).toBeFalsy();
  });

  it('should persist filters when they exist in local storage', async () => {
    const filterType = 'filterTypeSelect';
    localStorage.setItem('filtersSelected', 'item-three');
    render(
      <TaskListFilters
        filterList={filterList}
        filterName={filterName}
        filterType={filterType}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />,
    );

    expect(screen.getByRole('option', { name: 'Select filter' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item one' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item two' }).selected).toBe(false);
    expect(screen.getByRole('option', { name: 'Item three' }).selected).toBe(true);
    expect(localStorage.getItem('filtersSelected')).toBe('item-three');
  });
});
