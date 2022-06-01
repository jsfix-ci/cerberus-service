import FormRenderer, { Utils } from '@ukhomeoffice/cop-react-form-renderer';
import React, { useState, useCallback, useEffect } from 'react';
import filter from '../cop-forms/filter';

const AirpaxFilter = ({ taskStatus, onApply, appliedFilters, filtersAndSelectorsCount }) => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const movementModeCounts = filtersAndSelectorsCount?.slice(0, 3);
  const selectorCounts = filtersAndSelectorsCount?.slice(3);

  useEffect(() => {
    forceUpdate();
  }, [filtersAndSelectorsCount]);

  const getCountForOption = (fieldId, value) => {
    if (fieldId === 'hasSelectors') {
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

  const setupOptions = (component) => {
    return component.data.options.map((opt) => {
      const count = getCountForOption(component.fieldId, opt.value);
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

  const setupComponentOptions = (component) => {
    if (component.data?.options && component.dynamicOptions) {
      component.data.options = setupOptions(component);
    }
    return component;
  };

  const setupFilterCounts = () => {
    filter.pages = filter.pages.map((page) => {
      return {
        ...page,
        components: page.components.map((component) => setupComponentOptions(component)),
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

  const onApplyFilter = async (_, payload, onSuccess) => {
    onSuccess(payload);
    onApply(payload);
  };

  setupFilterCounts();

  return (
    <FormRenderer
      {...filter}
      hooks={{
        onGetComponent,
        onSubmit: onApplyFilter,
      }}
      data={appliedFilters}
    />
  );
};

export default AirpaxFilter;
