import setUpOptions from './setUpOptions';

describe('Custom.setupOptions', () => {
  const ID = 'test-id';
  const FIELD_ID = 'field-id';
  const LABEL = 'label';
  const OPTIONS = [];
  const CUSTOM_OPTIONS = {
    [ID]: [{ id: 'alpha', name: 'ALPHA' }],
  };

  it('should set up options for a component', () => {
    const COMPONENT = {
      id: 'test-id',
      label: LABEL,
      fieldId: FIELD_ID,
      type: 'text',
      data: {
        options: OPTIONS,
      },
    };

    const component = setUpOptions(COMPONENT, undefined);
    expect(component).toMatchObject({
      options: OPTIONS,
    });
  });

  it('should set up options for a component that uses custom options', () => {
    const COMPONENT = {
      id: ID,
      label: LABEL,
      fieldId: FIELD_ID,
      type: 'text',
      useCustomOptions: true,
    };

    const component = setUpOptions(COMPONENT, CUSTOM_OPTIONS);
    expect(component).toMatchObject({
      options: CUSTOM_OPTIONS[ID],
    });
  });
});
