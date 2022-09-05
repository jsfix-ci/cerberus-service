import meetsOneCondition from './meetsOneCondition';

describe('Custom.Condition.meetsOneCondition', () => {
  const DATA = { alpha: 'bravo', charlie: 'delta' };

  it.each([
    [null],
    [undefined],
  ])('should evaluate to true when component condition is invalid', (condition) => {
    const COMPONENT = {
      show_when: condition,
    };
    expect(meetsOneCondition(COMPONENT, DATA)).toBeTruthy();
  });

  it('should evaluate to false when component conditions is an empty array', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [],
      },
    };
    expect(meetsOneCondition(COMPONENT, DATA)).toBeFalsy();
  });

  it.each([
    [
      {
        show_when: {
          type: 'or',
          conditions: [
            {
              field: 'alpha',
              op: 'eq',
              value: 'bravo',
            },
          ],
        },
      },
    ],
    [
      {
        show_when: {
          type: 'or',
          conditions: [
            {
              field: 'alpha',
              op: 'eq',
              value: 'bravo',
            },
            {
              field: 'alpha',
              op: 'eq',
              value: 'delta',
            },
          ],
        },
      },
    ],
    [
      {
        show_when: {
          field: 'alpha',
          op: 'eq',
          value: 'bravo',
        },
      },
    ],
  ])('should evaluate to true when one or more component condition is provided and is met', (component) => {
    expect(meetsOneCondition(component, DATA)).toBeTruthy();
  });

  it('should evaluate to true when all component conditions are met', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [
          { field: 'alpha', op: 'eq', value: 'bravo' },
          { field: 'charlie', op: 'eq', value: 'delta' },
        ],
      },
    };

    expect(meetsOneCondition(COMPONENT, DATA)).toBeTruthy();
  });

  it('should evaluate to false when no component conditions are met', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [
          { field: 'alpha', op: 'eq', value: 'charlie' },
          { field: 'charlie', op: 'eq', value: 'alpha' },
        ],
      },
    };

    expect(meetsOneCondition(COMPONENT, DATA)).toBeFalsy();
  });
});
