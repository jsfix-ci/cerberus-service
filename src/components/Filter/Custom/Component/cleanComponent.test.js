import { COMPONENT_TYPES } from '../../../../utils/constants';
import cleanComponent from './cleanComponent';

describe('Custom.Component.cleanComponent', () => {
  it('should clean the component', () => {
    const ID = 'id';
    const LABEL = 'label';
    const FIELD_ID = 'field-id';
    const OPTIONS = [];
    const VALUE = ['alpha', 'bravo'];

    const COMPONENT = {
      id: ID,
      label: LABEL,
      fieldId: FIELD_ID,
      type: COMPONENT_TYPES.TEXT_INPUT,
      data: {
        options: OPTIONS,
      },
      options: OPTIONS,
      value: VALUE,
      dynamicOptions: true,
      multi: true,
    };

    expect(cleanComponent(COMPONENT)).toMatchObject({
      id: ID,
      label: LABEL,
      fieldId: FIELD_ID,
      type: COMPONENT_TYPES.TEXT_INPUT,
      options: OPTIONS,
      value: VALUE,
      multi: true,
    });
  });
});
