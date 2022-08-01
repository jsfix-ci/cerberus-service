import React from 'react';

const Filter = ({ filterSet, storedFilters, handleFilterChange, showFilterAndSelectorCount, parentIndex }) => {
  return (
    <div
      className="govuk-form-group"
      key={filterSet.filterLabel}
    >
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
          <h4 className="govuk-fieldset__heading">
            {filterSet.filterLabel}
          </h4>
        </legend>
        <ul
          className={`govuk-${filterSet.filterClassPrefix} govuk-${filterSet.filterClassPrefix}--small`}
        >
          {filterSet.filterOptions.map((option, index) => {
            let checked = !!(
              storedFilters
                && !!storedFilters.find((filter) => {
                  if (
                    filter === 'null'
                    && option.optionName === 'any'
                  ) {
                    return true;
                  }
                  return filter === option.optionName;
                })
            );
            return (
              <li
                className={`govuk-${filterSet.filterClassPrefix}__item`}
                key={option.optionName}
              >
                <input
                  className={`govuk-${filterSet.filterClassPrefix}__input`}
                  id={option.optionName}
                  name={filterSet.filterName}
                  type={filterSet.filterType}
                  value={option.optionName}
                  checked={checked}
                  onChange={(e) => {
                    checked = !checked;
                    handleFilterChange(e, option, filterSet);
                  }}
                  data-testid={`${filterSet.filterLabel}-${option.optionName}`}
                />
                <label
                  className={`govuk-!-padding-right-1 govuk-label govuk-${filterSet.filterClassPrefix}__label`}
                  htmlFor={option.optionName}
                >
                  {option.optionLabel} (
                  {showFilterAndSelectorCount(
                    parentIndex,
                    index,
                  )}
                  )
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
};

export default Filter;
