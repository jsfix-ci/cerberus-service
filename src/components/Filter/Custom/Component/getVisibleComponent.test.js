import getVisibleComponent from './getVisibleComponent';

describe('Custom.Component.getVisibleComponent', () => {
  it('should return the component when show when condition is met', () => {
    const DATA = {
      alpha: 'ALPHA',
    };
    const CONDITION = {
      field: 'alpha',
      op: 'eq',
      value: 'ALPHA',
    };

    const COMPONENT = {
      show_when: CONDITION,
    };

    expect(getVisibleComponent(COMPONENT, DATA)).toMatchObject(COMPONENT);
  });

  it('should return undefined when show when condition is not met', () => {
    const DATA = {
      alpha: 'ALPHA',
    };
    const CONDITION = {
      field: 'bravo',
      op: 'eq',
      value: 'BRAVO',
    };

    const COMPONENT = {
      show_when: CONDITION,
    };

    expect(getVisibleComponent(COMPONENT, DATA)).toBeUndefined();
  });
});
