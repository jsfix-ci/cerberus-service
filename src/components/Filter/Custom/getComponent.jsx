import React from 'react';

import { Checkboxes,
  FormGroup,
  MultiSelectAutocomplete,
  Radios,
  TextInput } from '@ukhomeoffice/cop-react-components';

import { COMPONENT_TYPES } from '../../../utils/constants';

const Select = (component) => {
  return (
    <select
      className="govuk-select"
      id={component.id}
      name={component.fieldId}
      onChange={component.onChange}
      onBlur={component.onChange}
      value={component.value}
    >
      {component.options.map((opt) => {
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
};

const getComponent = (component, wrapperOptions, componentOptions) => {
  switch (component.type) {
    case COMPONENT_TYPES.TYPE_TEXT_INPUT: {
      return (
        <FormGroup {...wrapperOptions}>
          <TextInput {...componentOptions} />
        </FormGroup>
      );
    }
    case COMPONENT_TYPES.TYPE_CHECKBOXES: {
      return (
        <FormGroup {...wrapperOptions}>
          <Checkboxes {...componentOptions} />
        </FormGroup>
      );
    }
    case COMPONENT_TYPES.TYPE_RADIOS: {
      return (
        <FormGroup {...wrapperOptions}>
          <Radios {...componentOptions} />
        </FormGroup>
      );
    }
    case COMPONENT_TYPES.TYPE_MULTIAUTOCOMPLETE: {
      return (
        <FormGroup {...wrapperOptions}>
          <MultiSelectAutocomplete {...componentOptions} />
        </FormGroup>
      );
    }
    case COMPONENT_TYPES.TYPE_SELECT: {
      return (
        <FormGroup {...wrapperOptions}>
          {Select(componentOptions)}
        </FormGroup>
      );
    }
    default: {
      return null;
    }
  }
};

export default getComponent;
