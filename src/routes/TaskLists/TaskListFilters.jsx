import React, { useState } from 'react';
import _ from 'lodash';

const filterTypeCheckbox = (filterList, handleFilterChange) => {
  if (filterList.length > 0) {
    filterList.map((filter) => {
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
    });
  }
};

const TaskListFilters = ({ filterList, filterName, filterType, onApplyFilters, onClearFilters }) => {
  const [filtersSelected, setFiltersSelected] = useState([]);

  const handleFilterChange = (e, code) => {
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
    localStorage.removeItem('checkbox', filtersSelected);
    e.preventDefault();
    if (filtersSelected.length > 0) {
      localStorage.setItem('checkbox', filtersSelected);
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
    localStorage.removeItem('checkbox', filtersSelected);
    const checkboxes = document.getElementsByName('filter');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkboxes[i].checked = !checkboxes[i].checked;
      }
    }
    onClearFilters(filterName);
  };

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
            <ul
              className="govuk-checkboxes cop-filters-options"
              data-module="govuk-checkboxes"
              data-testid="sorted-list"
            >
              {filterList.length > 0 && filterList.map((filter) => {
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
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default TaskListFilters;
