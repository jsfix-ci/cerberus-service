import React from 'react';
import renderer from 'react-test-renderer';

import TaskListCard from '../../TaskListPage/TaskListCard';
import targetTask from '../../__fixtures__/targetListData';

describe('TaskListCard', () => {
  it('should render the task list card for a target task', () => {
    const tree = renderer.create(<TaskListCard targetTask={targetTask} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
