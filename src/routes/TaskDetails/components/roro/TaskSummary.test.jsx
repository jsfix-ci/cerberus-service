import React from 'react';
import renderer from 'react-test-renderer';

import mockTargetTask from '../../../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import TaskSummary from './TaskSummary';

describe('RoRoTaskSummary', () => {
  it('should render the component without crashing', () => {
    const tree = renderer.create(<TaskSummary version={mockTargetTask.versions[0]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
