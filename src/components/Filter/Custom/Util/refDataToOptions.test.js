import refDataToOptions from './refDataToOptions';

describe('Custom.Util.refDataToOptions', () => {
  const DATA = {
    data: [
      { id: '1', name: 'Alpha', key: 'test-alpha' },
      { id: '2', name: 'Bravo', key: 'test-bravo' },
      { id: '3', name: 'Charlie', key: 'test-charlie' },
      { id: '4', name: 'Delta', key: 'test-delta' },
    ],
  };

  it('should set up refdata options with provided item structure', () => {
    const COMPONENT = {
      item: { id: 'id', label: 'name' },
    };

    const EXPECTED = DATA.data.map((opt) => {
      return {
        ...opt,
        value: opt.id,
        label: opt.name,
      };
    });

    expect(refDataToOptions(COMPONENT, DATA)).toMatchObject(EXPECTED);
  });

  it('should an empty array when no item structure is provided', () => {
    const COMPONENT = {};
    expect(refDataToOptions(COMPONENT, DATA)).toHaveLength(0);
  });

  it('should set up refdata options when item structure is an empty object', () => {
    const COMPONENT = {
      item: {},
    };

    const EXPECTED = DATA.data.map((opt) => {
      return {
        ...opt,
        value: opt.id,
        label: opt.name,
      };
    });

    expect(refDataToOptions(COMPONENT, DATA)).toMatchObject(EXPECTED);
  });

  it.each([
    [null],
    [undefined],
  ])('should an empty array when data is invalid', (data) => {
    const COMPONENT = {
      item: {},
    };

    expect(refDataToOptions(COMPONENT, data)).toHaveLength(0);
  });
});
