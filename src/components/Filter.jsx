import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import React, { useState, useCallback, useEffect } from 'react';
import { DEFAULT_APPLIED_RORO_FILTER_STATE, MOVEMENT_VARIANT } from '../constants';
import { airpax, roro } from '../cop-forms/filter';

const getCountForOption = (fieldId, value, taskStatus, movementModeCounts, selectorCounts) => {
  if (fieldId === 'hasSelectors') {
    if (value === DEFAULT_APPLIED_RORO_FILTER_STATE.hasSelectors) {
      value = null;
    }
    return selectorCounts?.find((f) => {
      return f.filterParams[fieldId] === JSON.parse(value);
    })?.statusCounts[taskStatus];
  }
  if (fieldId === 'selectors') {
    if (value === '') {
      value = null;
    }
    return selectorCounts?.find((f) => {
      return f.filterParams[fieldId] === value;
    })?.statusCounts[taskStatus];
  }
  if (fieldId === 'mode') {
    if (!value) {
      return null;
    }
    return movementModeCounts?.find((f) => {
      return f.filterParams.movementModes[0] === value;
    })?.statusCounts[taskStatus];
  }
  return 0;
};

const setupOptions = (component, taskStatus, movementModeCounts, selectorCounts) => {
  return component.data.options.map((opt) => {
    let count = getCountForOption(component.fieldId, opt.value, taskStatus, movementModeCounts, selectorCounts);
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

const setupComponentOptions = (component, taskStatus, movementModeCounts, selectorCounts) => {
  if (component.data?.options && component.dynamicOptions) {
    component.data.options = setupOptions(component, taskStatus, movementModeCounts, selectorCounts);
  }
  return component;
};

const setupFilterCounts = (filter, taskStatus, movementModeCounts, selectorCounts) => {
  filter.pages = filter.pages.map((page) => {
    return {
      ...page,
      components: page.components.map((component) => {
        return setupComponentOptions(component, taskStatus, movementModeCounts, selectorCounts);
      }),
    };
  });
};

const onGetComponent = (component, wrap) => {
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
      const attrs = Utils.Component.clean(component, ['fieldId', 'dynamicOptions']);
      return Utils.Component.wrap(attrs, select);
    }
    return select;
  }
  return null;
};

const AirpaxFilter = ({ taskStatus, onApply, appliedFilters, movementModeCounts, selectorCounts }) => {
  const onApplyFilter = async (_, payload, onSuccess) => {
    onSuccess(payload);
    onApply(payload);
  };

  setupFilterCounts(airpax, taskStatus, movementModeCounts, selectorCounts);

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

const RoRoFilter = ({ taskStatus, onApply, appliedFilters, movementModeCounts, selectorCounts }) => {
  const onApplyFilter = async (_, payload, onSuccess) => {
    onSuccess(payload);
    onApply(payload);
  };

  setupFilterCounts(roro, taskStatus, movementModeCounts, selectorCounts);

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

const getMovementSelectorCounts = (mode, filtersAndSelectorsCount) => {
  let movementModeCounts;
  let selectorCounts;
  if (mode === MOVEMENT_VARIANT.RORO) {
    movementModeCounts = filtersAndSelectorsCount?.slice(0, 3);
    selectorCounts = filtersAndSelectorsCount?.slice(3);
    return { movementModeCounts, selectorCounts };
  }
  movementModeCounts = filtersAndSelectorsCount?.slice(0, 1);
  selectorCounts = filtersAndSelectorsCount?.slice(1);
  return { movementModeCounts, selectorCounts };
};

const Filter = ({ mode, taskStatus, onApply, appliedFilters, filtersAndSelectorsCount }) => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    forceUpdate();
  }, [filtersAndSelectorsCount]);

  if (mode === MOVEMENT_VARIANT.RORO) {
    const { movementModeCounts, selectorCounts } = getMovementSelectorCounts(mode, filtersAndSelectorsCount);
    return (
      <RoRoFilter
        taskStatus={taskStatus}
        onApply={onApply}
        appliedFilters={appliedFilters}
        filtersAndSelectorsCount={filtersAndSelectorsCount}
        movementModeCounts={movementModeCounts}
        selectorCounts={selectorCounts}
      />
    );
  }

  const { movementModeCounts, selectorCounts } = getMovementSelectorCounts(mode, filtersAndSelectorsCount);
  return (
    <AirpaxFilter
      taskStatus={taskStatus}
      onApply={onApply}
      appliedFilters={appliedFilters}
      filtersAndSelectorsCount={filtersAndSelectorsCount}
      movementModeCounts={movementModeCounts}
      selectorCounts={selectorCounts}
    />
  );
};

export default Filter;
