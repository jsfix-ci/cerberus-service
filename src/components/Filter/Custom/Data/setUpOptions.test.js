import setUpOptions from './setUpOptions';

describe('Custom.Data.setupOptions', () => {
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

    expect(setUpOptions(COMPONENT, undefined)).toMatchObject({
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

    expect(setUpOptions(COMPONENT, CUSTOM_OPTIONS)).toMatchObject({
      options: CUSTOM_OPTIONS[ID],
    });
  });
});
