import React from 'react';
import renderer from 'react-test-renderer';

import RulesMatches from './RuleMatches';
import taskDetailsSelectors from '../../../__fixtures__/taskData_AirPax_TaskDetails_Selectors.fixture.json';

describe('RuleMatches', () => {
  it('should render RuleMatches component', () => {
    const tree = renderer.create(<RulesMatches version={taskDetailsSelectors.versions[0]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
