import { render } from '@testing-library/react';

import getComponent from './getComponent';
import { COMPONENT_TYPES } from '../../../../utils/constants';

describe('Custom.Component.getComponent', () => {
  it('should return an appropriately rendered text input', () => {
    const ID = 'test-id';
    const FIELD_ID = 'field-id';
    const LABEL = 'label';
    const OPTIONS = [];
    const KEY = 'test-key';
    const DATA = {};

    const COMPONENT = {
      id: ID,
      label: LABEL,
      fieldId: FIELD_ID,
      type: 'text',
      data: {
        options: OPTIONS,
      },
    };

    const WRAPPER_OPTIONS = {
      id: ID,
      label: LABEL,
    };

    const COMPONENT_OPTIONS = {
      ...WRAPPER_OPTIONS,
      fieldId: FIELD_ID,
      type: COMPONENT_TYPES.TEXT_INPUT,
      options: OPTIONS,
    };

    const { container } = render(getComponent(KEY, DATA, COMPONENT, WRAPPER_OPTIONS, COMPONENT_OPTIONS));

    const formGroup = container.getElementsByClassName('govuk-form-group');
    expect(formGroup).toBeDefined();
    expect(formGroup).toHaveLength(1);
    expect(formGroup[0].tagName).toEqual('DIV');
    const labels = container.getElementsByClassName('govuk-label');
    expect(labels).toHaveLength(1);
    expect(labels[0].tagName).toEqual('LABEL');
    expect(labels[0].textContent).toEqual('label (optional)');
  });
});
