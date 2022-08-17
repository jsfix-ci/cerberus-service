import { render, screen } from '@testing-library/react';
import React from 'react';

import { VIEW } from '../../utils/constants';
import config from '../../utils/config';

import Header from './Header';

describe('Header', () => {
  beforeEach(() => {
    config.copTargetingApiEnabled = true;
    config.roroV2ViewEnabled = true;
  });

  it('should render the task list page header when view is RoRo V2', () => {
    render(
      <Header
        view={VIEW.RORO}
        selectTabIndex={jest.fn()}
        selectTaskManagementTabIndex={jest.fn()}
      />,
    );

    expect(screen.getByText('Task management (RoRo V2)')).toBeInTheDocument();
    expect(screen.getByText('RoRo tasks')).toBeInTheDocument();
    expect(screen.getByText('Airpax tasks')).toBeInTheDocument();
  });

  it('should render the task list page header when view is AirPax', () => {
    render(
      <Header
        view={VIEW.AIRPAX}
        selectTabIndex={jest.fn()}
        selectTaskManagementTabIndex={jest.fn()}
      />,
    );

    expect(screen.getByText('Task management (AirPax)')).toBeInTheDocument();
    expect(screen.getByText('RoRo tasks')).toBeInTheDocument();
    expect(screen.getByText('RoRo V2 tasks')).toBeInTheDocument();
  });
});
