import React from 'react';

import { Checkboxes,
  FormGroup,
  MultiSelectAutocomplete,
  Radios,
  TextInput } from '@ukhomeoffice/cop-react-components';

import { COMPONENT_TYPES } from '../../../../utils/constants';

const getTextInput = (key, wrapperOptions, componentOptions) => {
  return (
    <FormGroup key={key} {...wrapperOptions}>
      <TextInput {...componentOptions} />
    </FormGroup>
  );
};

const getCheckboxes = (key, wrapperOptions, componentOptions) => {
  return (
    <FormGroup key={key} {...wrapperOptions}>
      <Checkboxes {...componentOptions} />
    </FormGroup>
  );
};

const getRadios = (key, wrapperOptions, componentOptions) => {
  return (
    <FormGroup key={key} {...wrapperOptions}>
      <Radios {...componentOptions} />
    </FormGroup>
  );
};

const getMultiSelect = (key, wrapperOptions, componentOptions) => {
  return (
    <FormGroup key={key} {...wrapperOptions}>
      <MultiSelectAutocomplete {...componentOptions} />
    </FormGroup>
  );
};

const getSelect = (key, wrapperOptions, componentOptions) => {
  return (
    <FormGroup key={key} {...wrapperOptions}>
      <select
        className="govuk-select"
        id={componentOptions.id}
        name={componentOptions.fieldId}
        onChange={componentOptions.onChange}
        onBlur={componentOptions.onChange}
        value={componentOptions.value}
      >
        {componentOptions.options.map((opt) => {
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
    </FormGroup>
  );
};

const getComponent = (key, data, component, wrapperOptions, componentOptions) => {
  switch (component.type) {
    case COMPONENT_TYPES.TEXT_INPUT: {
      return getTextInput(key, wrapperOptions, componentOptions);
    }
    case COMPONENT_TYPES.CHECKBOXES: {
      return getCheckboxes(key, wrapperOptions, componentOptions);
    }
    case COMPONENT_TYPES.RADIOS: {
      return getRadios(key, wrapperOptions, componentOptions);
    }
    case COMPONENT_TYPES.MULTIAUTOCOMPLETE: {
      return getMultiSelect(key, wrapperOptions, componentOptions);
    }
    case COMPONENT_TYPES.SELECT: {
      return getSelect(key, wrapperOptions, componentOptions);
    }
    default: {
      return null;
    }
  }
};

export default getComponent;
