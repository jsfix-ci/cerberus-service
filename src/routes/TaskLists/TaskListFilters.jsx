import React, { useEffect, useState } from 'react';

const FilterTypeCheckbox = ({ filterList, handleFilterChange }) => {
  /*
   * To create a checkbox list for filters you must pass in
   * an array of objects that contain the following:
   * {
   *  name: 'one',
   *  code: 'one',
   *  label: 'Option one',
   *  checked: false,
   * }
   * And a filterType of filterTypeCheckbox
  */
  if (filterList.length > 0) {
    return (
      <ul
        className="govuk-checkboxes"
        data-module="govuk-checkboxes"
        data-testid="sorted-list"
      >
        {filterList.map((filter) => {
          let checked = true;
          return (
            <li
              className="govuk-checkboxes__item govuk-!-margin-bottom-5"
              key={filter.code}
            >
              <input
                className="govuk-checkboxes__input"
                id={filter.code}
                name="filter"
                type="checkbox"
                value={filter.name}
                defaultChecked={filter.checked}
                onChange={(e) => {
                  checked = !checked;
                  handleFilterChange(e, filter.code, 'filterTypeCheckbox');
                }}
                data-testid={`checkbox-${filter.code}`}
              />
              <label
                className="govuk-label govuk-checkboxes__label govuk-!-padding-top-0"
                htmlFor={filter.code}
              >
                {filter.name}
              </label>
            </li>
          );
        })}
      </ul>
    );
  }
  return null;
};

const FilterTypeSelect = ({ filterList, handleFilterChange }) => {
  /*
   * To create a select dropdown for filters you must pass in
   * an array of objects that contain the following:
   * {
   *  name: 'one',
   *  code: 'one',
   *  label: 'Option one',
   *  checked: false,
   * }
   * And a filterType of filterTypeSelect
  */
  if (filterList.length > 0) {
    return (
      // eslint-disable-next-line jsx-a11y/no-onchange
      <select
        data-testid="target-filter-select"
        className="govuk-select"
        value={localStorage.getItem('filtersSelected') || ''}
        onChange={(e) => {
          localStorage.setItem('filtersSelected', e.target.value);
          handleFilterChange(e, e.target.value, 'filterTypeSelect');
        }}
      >
        <option key="default" value="">Select filter</option>
        {filterList.map((o) => (
          <option key={o.code} value={o.code}>{o.label}</option>
        ))}
      </select>
    );
  }
  return null;
};

const TaskListFilters = ({ filterList, filterName, filterType, onApplyFilters, onClearFilters }) => {
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [filterListAndState, setFilterListAndState] = useState([]);

  const getAlreadySelectedFilters = () => {
    const selected = localStorage.getItem('filtersSelected')?.split(',') || [];
    setFiltersSelected(selected);
  };

  const getFilterState = () => {
    const createFilterListAndStateArray = [];
    filterList.map((filterItem) => {
      createFilterListAndStateArray.push({
        ...filterItem,
        checked: filtersSelected.includes(filterItem.code) || filterItem.checked,
      });
    });
    setFilterListAndState(createFilterListAndStateArray);
  };

  const handleFilterChange = (e, code, type) => {
    if (type === 'filterTypeSelect') {
      setFiltersSelected([code]);
    }
    if (e.target.checked) {
      setFiltersSelected((previousSelected) => {
        return [...previousSelected, code];
      });
    } else if (!e.target.checked && type === 'filterTypeCheckbox') {
      setFiltersSelected(filtersSelected.filter((item) => item !== code));
    }
  };

  const handleFilterApply = (e) => {
    e.preventDefault();
    if (filtersSelected.length > 0) {
      localStorage.setItem('filtersSelected', filtersSelected);
      onApplyFilters(filtersSelected);
    }
  };

  const handleFilterReset = (e) => {
    e.preventDefault();
    /*
     * Clearing filters returns everything to default state
     * display targets for ALL users groups
     * reset groups selected to null
     * uncheck any checked checkboxes
     */
    setFiltersSelected([]);
    localStorage.removeItem('filtersSelected', filtersSelected);
    const checkboxes = document.getElementsByName('filter');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkboxes[i].checked = !checkboxes[i].checked;
      }
    }
    onClearFilters(filterName);
  };

  const getFilterType = (type) => {
    switch (type) {
      case 'filterTypeCheckbox':
        return <FilterTypeCheckbox filterList={filterListAndState} handleFilterChange={handleFilterChange} />;
      case 'filterTypeSelect':
        return <FilterTypeSelect filterList={filterListAndState} handleFilterChange={handleFilterChange} />;
      default:
        return <FilterTypeSelect filterList={filterListAndState} handleFilterChange={handleFilterChange} />;
    }
  };

  useEffect(() => {
    getAlreadySelectedFilters();
  }, []);

  useEffect(() => {
    if (filterList.length > 0) {
      getFilterState();
    }
  }, [filterList, filtersSelected]);

  return (
    <div className="cop-filters-container">
      <div className="cop-filters-header">
        <h2 className="govuk-heading-s">Filter</h2>
      </div>

      <div className="cop-filters-controls">
        <div className="govuk-button-group">
          <button
            className="govuk-button"
            data-module="govuk-button"
            type="button"
            onClick={(e) => {
              handleFilterApply(e);
            }}
          >
            Apply filters
          </button>
          <button
            className="govuk-link"
            data-module="govuk-button"
            type="button"
            onClick={(e) => {
              handleFilterReset(e);
            }}
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="cop-filters-options">
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              <h3 className="govuk-fieldset__heading">Select filter</h3>
            </legend>
            {getFilterType(filterType)}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default TaskListFilters;
