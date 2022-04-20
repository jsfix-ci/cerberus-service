import React from 'react';
import { render, screen} from '@testing-library/react';
import renderer from 'react-test-renderer';

import TaskListCard from '../../TaskListPage/TaskListCard';
import targetTask from '../../__fixtures__/targetListData';

describe('TaskListCard', () => {
  it('should test time', () => {
    render(<TaskListCard targetTask={targetTask} />);
    expect(screen.getByText(/7 Aug 2020 at 18:15/)).toBeInTheDocument();
  });

  it('should render the task list card for a target task', () => {
    const tree = renderer.create(<TaskListCard targetTask={targetTask} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
