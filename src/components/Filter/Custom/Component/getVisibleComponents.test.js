import getVisibleComponents from './getVisibleComponents';

describe('Custom.Component.getVisibleComponents', () => {
  it('should return array of components to render when condition is met', () => {
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

    expect(getVisibleComponents([COMPONENT], DATA)).toMatchObject([COMPONENT]);
  });

  it('should return an empty components array when condition is not met', () => {
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

    expect(getVisibleComponents([COMPONENT], DATA)).toHaveLength(0);
  });
});
