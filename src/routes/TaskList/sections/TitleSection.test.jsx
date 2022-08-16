import React from 'react';
import renderer from 'react-test-renderer';

import { TitleSection } from './index';
import { TASK_STATUS, VIEW } from '../../../utils/constants';

import mockRoRoTargetTask from '../../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import mockAirpaxTargetTask from '../../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import mockRoRoFootPassengerTask from '../../../__fixtures__/taskData_RoRo_Foot_Passenger_AssigneeCurrentUser.fixture.json';

describe('TitleSection', () => {
  it('should render the title section for RoRo v2 accompanied', () => {
    const tree = renderer.create(
      <TitleSection view={VIEW.RORO} targetTask={mockRoRoTargetTask} taskStatus={TASK_STATUS.NEW} currentUser="test" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the title section for RoRo v2 foot passenger', () => {
    const tree = renderer.create(
      <TitleSection view={VIEW.RORO} targetTask={mockRoRoFootPassengerTask} taskStatus={TASK_STATUS.NEW} currentUser="test" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the title section for Airpax', () => {
    const tree = renderer.create(
      <TitleSection view={VIEW.AIRPAX} targetTask={mockAirpaxTargetTask} taskStatus={TASK_STATUS.NEW} currentUser="test" />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
