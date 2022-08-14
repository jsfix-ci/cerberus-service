import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import { MultiSelectAutocomplete } from '@ukhomeoffice/cop-react-components';
import React, { useState, useCallback, useEffect } from 'react';
import { COMPONENT_TYPES, VIEW } from '../../utils/constants';

import { airpax, roro } from '../../forms/filter';

const getMovementSelectorCounts = (view, filtersAndSelectorsCount) => {
  if (view === VIEW.RORO_V2) {
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

const Filter = ({ view, taskStatus: _taskStatus, onApply, appliedFilters, filtersAndSelectorsCount, rulesOptions }) => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const { movementModeCounts, modeSelectorCounts } = getMovementSelectorCounts(view, filtersAndSelectorsCount);

  const getCountForOption = (fieldId, value, taskStatus, modeCounts, selectorCounts) => {
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

  if (view === VIEW.RORO_V2) {
    return (
      <RoRoFilter />
    );
  }

  return (
    <AirpaxFilter />
  );
};

export default Filter;
