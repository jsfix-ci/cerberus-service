import React from 'react';
import renderer from 'react-test-renderer';

import mockTargetTask from '../../../../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import RoRoTaskSummary from './RoRoTaskSummary';

describe('RoRoTaskSummary', () => {
  it('should render the component without crashing', () => {
    const tree = renderer.create(<RoRoTaskSummary version={mockTargetTask.versions[0]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
