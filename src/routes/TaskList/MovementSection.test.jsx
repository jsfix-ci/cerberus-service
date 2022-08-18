import React from 'react';
import renderer from 'react-test-renderer';

import { MovementSection } from './index';

import mockRoRoTargetTask from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import mockAirpaxTargetTask from '../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import mockRoRoFootPassengerTask from '../../__fixtures__/taskData_RoRo_Foot_Passenger_AssigneeCurrentUser.fixture.json';

// TODO: Test names will need updating once RoRo V1 is replaced.
describe('MovementSection', () => {
  it('should render the movement section for RoRo V2', () => {
    const tree = renderer.create(<MovementSection targetTask={mockRoRoTargetTask} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the movement section for a RoRo V2 foot passenger', () => {
    const tree = renderer.create(<MovementSection targetTask={mockRoRoFootPassengerTask} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the movement section for Airpax', () => {
    const tree = renderer.create(<MovementSection targetTask={mockAirpaxTargetTask} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
