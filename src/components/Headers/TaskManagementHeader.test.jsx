import { render, screen } from '@testing-library/react';
import React from 'react';

import TaskManagementHeader from './TaskManagementHeader';

describe('TaskManagementHeader', () => {
  const LINKS = [
    {
      url: 'alpha-url/1',
      label: 'ALPHA URL 1',
      show: true,
    },
    {
      url: 'alpha-url/2',
      label: 'ALPHA URL 2',
      show: true,
    },
  ];

  it('should render a header with enabled links', () => {
    render(
      <TaskManagementHeader
        headerText="Hello"
        links={LINKS}
        selectTaskManagementTabIndex={jest.fn()}
      />,
    );

    expect(screen.queryAllByText('Task management (Hello)')).toHaveLength(1);
    expect(screen.queryAllByText('ALPHA URL 1')).toHaveLength(1);
    expect(screen.queryAllByText('ALPHA URL 2')).toHaveLength(1);
  });

  it('should render a header with part enabled and part disabled links', () => {
    LINKS[1].show = false;

    render(
      <TaskManagementHeader
        headerText="Hello"
        links={LINKS}
        selectTaskManagementTabIndex={jest.fn()}
      />,
    );

    expect(screen.queryAllByText('Task management (Hello)')).toHaveLength(1);
    expect(screen.queryAllByText('ALPHA URL 1')).toHaveLength(1);
    expect(screen.queryAllByText('ALPHA URL 2')).toHaveLength(0);
  });
});
