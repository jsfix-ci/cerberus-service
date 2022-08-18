import React from 'react';
import renderer from 'react-test-renderer';

import SelectorMatches from '../../TaskDetails/builder/SelectorMatches';
import taskDetailsSelectors from '../../__fixtures__/taskData_AirPax_TaskDetails_Selectors.fixture.json';

describe('SelectorMatches', () => {
  it('should render SelectorMatches component', () => {
    const tree = renderer.create(<SelectorMatches version={taskDetailsSelectors.versions[0]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
