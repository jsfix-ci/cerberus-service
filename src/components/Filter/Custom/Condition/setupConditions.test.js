import setupConditions from './setupConditions';

describe('Custom.Condition.setupConditions', () => {
  it('should setup condition when component does not contain a collection of conditions', () => {
    const CONDITION = {
      field: 'alpha',
      op: 'eq',
      value: 'ALPHA',
    };

    const COMPONENT = {
      type: 'or',
      show_when: CONDITION,
    };

    const condition = setupConditions(COMPONENT);
    expect(condition).toMatchObject([COMPONENT.show_when]);
  });

  it('should setup condition when component contains a collection of conditions', () => {
    const CONDITION = {
      field: 'alpha',
      op: 'eq',
      value: 'ALPHA',
    };

    const COMPONENT = {
      show_when: {
        type: 'or',
        conditions: [CONDITION, CONDITION],
      },
    };

    const condition = setupConditions(COMPONENT);
    expect(condition).toMatchObject([CONDITION, CONDITION]);
  });
});
