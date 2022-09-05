import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import { MultiSelectAutocomplete } from '@ukhomeoffice/cop-react-components';
import React from 'react';

import { COMPONENT_TYPES, MODE } from '../../utils/constants';

import FormUtils from '../../utils/Form/ReactForm';
import setupFilterCounts from './helper/setupCounts';

import filter from '../../forms/filters';

const getMovementSelectorCounts = (filtersAndSelectorsCount) => {
  return {
    movementModeCounts: filtersAndSelectorsCount?.slice(0, 1),
    modeSelectorCounts: filtersAndSelectorsCount?.slice(1),
  };
};

const AirpaxFilter = ({ taskStatus,
  currentUser,
  onApply,
  appliedFilters,
  filtersAndSelectorsCount,
  rulesOptions,
  handleFilterReset }) => {
  const { movementModeCounts, modeSelectorCounts } = getMovementSelectorCounts(filtersAndSelectorsCount);

  const onGetComponent = (component, wrap) => {
    const attrs = Utils.Component.clean(component, ['fieldId', 'dynamicOptions', 'multi']);
    if (component.type === COMPONENT_TYPES.SELECT) {
      const select = (
        <select
          className="govuk-select"
          id={component.id}
          name={component.fieldId}
          onChange={component.onChange}
          onBlur={component.onChange}
          value={component.value}
        >
          {component.data.options.map((opt) => {
            return (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            );
          })}
        </select>
      );
      if (wrap) {
        return Utils.Component.wrap(attrs, select);
      }
      return select;
    }
    if (component.type === COMPONENT_TYPES.MULTIAUTOCOMPLETE) {
      const multiSelect = (
        <MultiSelectAutocomplete
          className="hods-multi-select-autocomplete"
          {...component}
          item={{ value: 'id', label: 'name' }}
          options={rulesOptions}
        />
      );
      if (wrap) {
        return Utils.Component.wrap(attrs, multiSelect);
      }
      return multiSelect;
    }
    return null;
  };

  const onApplyFilter = async (_, payload, onSuccess) => {
    onSuccess(payload);
    onApply(payload);
  };

  const filterJson = setupFilterCounts(
    filter(currentUser, FormUtils.showAssigneeComponent(taskStatus), MODE.AIRPAX), taskStatus, movementModeCounts, modeSelectorCounts,
  );

  return (
    <div className="cop-filters-container">
      <div className="cop-filters-header">
        <h2 className="govuk-heading-s">Filters</h2>
        <button
          className="govuk-link govuk-heading-s "
          data-module="govuk-button"
          type="button"
          onClick={(e) => handleFilterReset(e)}
        >
          Clear all filters
        </button>
      </div>
      <div>
        <FormRenderer
          {...filterJson}
          hooks={{
            onGetComponent,
            onSubmit: onApplyFilter,
          }}
          data={appliedFilters}
        />
      </div>
    </div>
  );
};

export default AirpaxFilter;
