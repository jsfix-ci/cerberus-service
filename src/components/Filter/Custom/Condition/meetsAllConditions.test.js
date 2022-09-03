import meetsAllConditions from './meetsAllConditions';

describe('Custom.Condition.meetsAllConditions', () => {
  const DATA = { alpha: 'bravo', charlie: 'delta' };

  it.each([
    [null],
    [undefined],
  ])('should evaluate to true when component condition is invalid', (condition) => {
    const COMPONENT = {
      show_when: condition,
    };
    expect(meetsAllConditions(COMPONENT, DATA)).toBeTruthy();
  });

  it('should evaluate to true when component conditions is an empty array', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [],
      },
    };
    expect(meetsAllConditions(COMPONENT, DATA)).toBeTruthy();
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
              field: 'charlie',
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
  ])('should evaluate to true when all component condition is met', (component) => {
    expect(meetsAllConditions(component, DATA)).toBeTruthy();
  });

  it('should evaluate to false when a single condition is not met', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [{ field: 'alpha', op: 'ne', value: 'bravo' }],
      },
    };
    expect(meetsAllConditions(COMPONENT, DATA)).toBeFalsy();
  });

  it('should evaluate to true when all conditions are met', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [
          { field: 'alpha', op: 'eq', value: 'bravo' },
          { field: 'charlie', op: 'eq', value: 'delta' },
        ],
      },
    };
    expect(meetsAllConditions(COMPONENT, DATA)).toBeTruthy();
  });

  it('should evaluate to false when one of the conditions is not met', () => {
    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [
          { field: 'alpha', op: 'eq', value: 'bravo' },
          { field: 'charlie', op: 'eq', value: 'echo' },
        ],
      },
    };
    expect(meetsAllConditions(COMPONENT, DATA)).toBeFalsy();
  });
});
