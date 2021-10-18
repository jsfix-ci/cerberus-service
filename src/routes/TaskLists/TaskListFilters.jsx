import React, { useEffect, useState } from 'react';
import _ from 'lodash';

const FilterTypeCheckbox = ({ filterList, handleFilterChange }) => {
  /*
   * To create a checkbox list for filters you must pass in
   * an array of objects that contain the following:
   * {
   *  name: 'one',
   *  code: 'one',
   *  label: 'Option one',
   *  count: 3,
   *  checked: false,
   * }
   * And a filterType of filterTypeCheckbox
  */
  if (filterList.length > 0) {
    return (
      <ul
        className="govuk-checkboxes cop-filters-options"
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
                  handleFilterChange(e, filter.code);
                }}
                data-testid={`checkbox-${filter.code}`}
              />
              <label
                className="govuk-label govuk-checkboxes__label govuk-!-padding-top-0"
                htmlFor={filter.code}
              >
                {filter.name} <br />
                <strong>{filter.count} targets</strong>
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
   *  count: 3,
   *  checked: false,
   * }
   * where the first item in the array is your disabled default item
   * {
   * name: 'default',
   * code: 'default',
   * label: 'Select filter',
   * count: null,
   * checked: true,
   * }
   * And a filterType of filterTypeSelect
  */
  if (filterList.length > 0) {
    return (
    // eslint-disable-next-line jsx-a11y/no-onchange
      <select
        value={localStorage.getItem('filtersSelected') || filterList[0].label}
        onChange={(e) => {
          localStorage.setItem('filtersSelected', e.target.value);
          handleFilterChange(e, e.target.value, 'filterTypeSelect');
        }}
      >
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
        name: filterItem.name,
        code: filterItem.code,
        label: filterItem.label,
        count: filterItem.count,
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
      setFiltersSelected([...filtersSelected, code]);
    } else if (!e.target.checked) {
      const array = [...filtersSelected];
      const updatedArr = _.remove(array, (item) => {
        return item !== code;
      });
      setFiltersSelected(updatedArr);
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
              <h3 className="govuk-fieldset__heading">Title</h3>
            </legend>
            {filterType === 'filterTypeCheckbox' && <FilterTypeCheckbox filterList={filterListAndState} handleFilterChange={handleFilterChange} />}
            {filterType === 'filterTypeSelect' && <FilterTypeSelect filterList={filterListAndState} handleFilterChange={handleFilterChange} />}
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default TaskListFilters;
