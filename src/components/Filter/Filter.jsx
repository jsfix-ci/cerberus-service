import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import { MultiSelectAutocomplete } from '@ukhomeoffice/cop-react-components';
import React from 'react';
import { COMPONENT_TYPES, MODE } from '../../utils/constants';

import { airpax, roro } from '../../forms/filters';
import setupFilterCounts from './helper/setupCounts';
import FormUtils from '../../utils/Form/ReactForm';

const getMovementSelectorCounts = (mode, filtersAndSelectorsCount) => {
  if (mode === MODE.RORO) {
    return {
      movementModeCounts: filtersAndSelectorsCount?.slice(0, 3),
      modeSelectorCounts: filtersAndSelectorsCount?.slice(3),
    };
  }
  return {
    movementModeCounts: filtersAndSelectorsCount?.slice(0, 1),
    modeSelectorCounts: filtersAndSelectorsCount?.slice(1),
  };
};

const Filter = ({ mode,
  taskStatus,
  currentUser,
  onApply,
  appliedFilters,
  filtersAndSelectorsCount,
  rulesOptions,
  handleFilterReset }) => {
  const { movementModeCounts, modeSelectorCounts } = getMovementSelectorCounts(mode, filtersAndSelectorsCount);
  let jsxFilterElement;

  const onGetComponent = (component, wrap) => {
    const attrs = Utils.Component.clean(component, ['fieldId', 'dynamicOptions', 'multi']);
    if (component.type === COMPONENT_TYPES.TYPE_SELECT) {
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
    if (component.type === COMPONENT_TYPES.TYPE_MULTIAUTOCOMPLETE) {
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

  const AirpaxFilter = () => {
    const filterJson = setupFilterCounts(
      airpax(currentUser, FormUtils.showAssigneeComponent(taskStatus)), taskStatus, movementModeCounts, modeSelectorCounts,
    );

    return (
      <FormRenderer
        {...filterJson}
        hooks={{
          onGetComponent,
          onSubmit: onApplyFilter,
        }}
        data={appliedFilters}
      />
    );
  };

  const RoRoFilter = () => {
    const filterJson = setupFilterCounts(
      roro(currentUser, FormUtils.showAssigneeComponent(taskStatus)), taskStatus, movementModeCounts, modeSelectorCounts,
    );

    return (
      <FormRenderer
        {...filterJson}
        hooks={{
          onSubmit: onApplyFilter,
        }}
        data={appliedFilters}
      />
    );
  };

  if (mode === MODE.RORO) {
    jsxFilterElement = (
      <RoRoFilter />
    );
  }
  if (mode === MODE.AIRPAX) {
    jsxFilterElement = (
      <AirpaxFilter />
    );
  }
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
        {jsxFilterElement}
      </div>
    </div>
  );
};

export default Filter;
