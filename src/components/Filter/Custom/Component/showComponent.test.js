import showComponent from './showComponent';

describe('Custom.Component.showComponent', () => {
  it('should evaluate to true when condition to show component is met', () => {
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

    expect(showComponent(COMPONENT, DATA)).toBeTruthy();
  });

  it('should evaluate to true when no condition is provided', () => {
    const DATA = {
      alpha: 'ALPHA',
    };

    const COMPONENT = {};

    expect(showComponent(COMPONENT, DATA)).toBeTruthy();
  });

  it('should evaluate to false when condition is not met', () => {
    const DATA = {
      bravo: 'BRAVO',
    };
    const CONDITION = {
      field: 'alpha',
      op: 'eq',
      value: 'ALPHA',
    };

    const COMPONENT = {
      show_when: CONDITION,
    };

    expect(showComponent(COMPONENT, DATA)).toBeFalsy();
  });
});
