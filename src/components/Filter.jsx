import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import { MultiSelectAutocomplete } from '@ukhomeoffice/cop-react-components';
import React, { useState, useCallback, useEffect } from 'react';
import { DEFAULT_APPLIED_RORO_FILTER_STATE, MOVEMENT_VARIANT } from '../constants';

import { airpax, roro } from '../cop-forms/filter';

const getMovementSelectorCounts = (mode, filtersAndSelectorsCount) => {
  if (mode === MOVEMENT_VARIANT.RORO) {
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

const Filter = ({ mode, taskStatus: _taskStatus, onApply, appliedFilters, filtersAndSelectorsCount, rulesOptions }) => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const { movementModeCounts, modeSelectorCounts } = getMovementSelectorCounts(mode, filtersAndSelectorsCount);

  const getCountForOption = (fieldId, value, taskStatus, modeCounts, selectorCounts) => {
    if (fieldId === 'hasSelectors') {
      if (value === DEFAULT_APPLIED_RORO_FILTER_STATE.hasSelectors) {
        value = null;
      }
      return selectorCounts?.find((f) => {
        return f.filterParams[fieldId] === JSON.parse(value);
      })?.statusCounts[taskStatus];
    }
    if (fieldId === 'selectors') {
      return selectorCounts?.find((f) => {
        return f.filterParams[fieldId] === value;
      })?.statusCounts[taskStatus];
    }
    if (fieldId === 'mode') {
      if (!value) {
        return null;
      }
      return modeCounts?.find((f) => {
        return f.filterParams.movementModes[0] === value;
      })?.statusCounts[taskStatus];
    }
    return 0;
  };

  const setupOptions = (component, taskStatus, modeCounts, selectorCounts) => {
    return component.data.options.map((opt) => {
      let count = getCountForOption(component.fieldId, opt.value, taskStatus, modeCounts, selectorCounts);
      count = count === undefined ? 0 : count;
      const originalLabel = opt.originalLabel || opt.label;
      const label = count === null ? originalLabel : `${originalLabel} (${count})`;
      return {
        ...opt,
        count,
        originalLabel,
        label,
      };
    });
  };

  const setupComponentOptions = (component, taskStatus, modeCounts, selectorCounts) => {
    if (component.data?.options && component.dynamicOptions) {
      component.data.options = setupOptions(component, taskStatus, modeCounts, selectorCounts);
    }
    return component;
  };

  const setupFilterCounts = (filter, taskStatus, modeCounts, selectorCounts) => {
    filter.pages = filter.pages.map((page) => {
      return {
        ...page,
        components: page.components.map((component) => {
          return setupComponentOptions(component, taskStatus, modeCounts, selectorCounts);
        }),
      };
    });
  };

  const onGetComponent = (component, wrap) => {
    const attrs = Utils.Component.clean(component, ['fieldId', 'dynamicOptions', 'multi']);
    if (component.type === 'select') {
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
    if (component.type === 'multiautocomplete') {
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
    if (component.type === "textinput") {
      const textInput = (
        <input 
          type='text'
          className='govuk-input'
          id={component.id} 
          name={component.fieldId} 
          onChange={component.onChange}
          onBlur={component.onChange}
          value={component.value} />
      );
      if (wrap) {
        return Utils.Component.wrap(attrs, textInput);
      }
      return textInput;
    }
    return null;
  };

  const AirpaxFilter = () => {
    const onApplyFilter = async (_, payload, onSuccess) => {
      onSuccess(payload);
      onApply(payload);
    };

    setupFilterCounts(airpax, _taskStatus, movementModeCounts, modeSelectorCounts);

    return (
      <FormRenderer
        {...airpax}
        hooks={{
          onGetComponent,
          onSubmit: onApplyFilter,
        }}
        data={appliedFilters}
      />
    );
  };

  const RoRoFilter = () => {
    const onApplyFilter = async (_, payload, onSuccess) => {
      onSuccess(payload);
      onApply(payload);
    };

    setupFilterCounts(roro, _taskStatus, movementModeCounts, modeSelectorCounts);

    return (
      <FormRenderer
        {...roro}
        hooks={{
          onGetComponent,
          onSubmit: onApplyFilter,
        }}
        data={appliedFilters}
      />
    );
  };

  useEffect(() => {
    forceUpdate();
  }, [filtersAndSelectorsCount]);

  if (mode === MOVEMENT_VARIANT.RORO) {
    return (
      <RoRoFilter
        taskStatus={_taskStatus}
        onApply={onApply}
        appliedFilters={appliedFilters}
        filtersAndSelectorsCount={filtersAndSelectorsCount}
        movementModeCounts={movementModeCounts}
        selectorCounts={modeSelectorCounts}
      />
    );
  }

  return (
    <AirpaxFilter
      taskStatus={_taskStatus}
      onApply={onApply}
      appliedFilters={appliedFilters}
      filtersAndSelectorsCount={filtersAndSelectorsCount}
      movementModeCounts={movementModeCounts}
      selectorCounts={modeSelectorCounts}
      rulesOptions={rulesOptions}
    />
  );
};

export default Filter;
