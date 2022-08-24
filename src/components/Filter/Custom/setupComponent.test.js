import setupComponent from './setupComponent';
import { COMPONENT_TYPES } from '../../../utils/constants';

describe('Custom.setupComponent', () => {
  it('should appropriately setup a component', () => {
    const ID = 'id';
    const LABEL = 'label';
    const FIELD_ID = 'field-id';
    const OPTIONS = [];

    const DATA = {};
    const COMPONENT = {
      id: ID,
      label: LABEL,
      fieldId: FIELD_ID,
      type: COMPONENT_TYPES.TEXT_INPUT,
      data: {
        options: OPTIONS,
      },
      dynamicOptions: true,
      multi: true,
    };
    const CUSTOM_OPTIONS = {};
    const ON_CHANGE = jest.fn();

    const { wrapperOptions, componentOptions } = setupComponent(DATA, COMPONENT, CUSTOM_OPTIONS, ON_CHANGE);
    expect(wrapperOptions).toMatchObject({
      id: ID,
      label: LABEL,
    });
    expect(componentOptions).toMatchObject({
      id: ID,
      label: LABEL,
      fieldId: FIELD_ID,
      type: COMPONENT_TYPES.TEXT_INPUT,
      options: OPTIONS,
      value: '',
      onChange: ON_CHANGE,
    });
  });
});
