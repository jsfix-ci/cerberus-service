import React from 'react';
import renderer from 'react-test-renderer';

import { VoyageSection } from './index';

import mockRoRoTargetTask from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';
import mockAirpaxTargetTask from '../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';
import mockRoRoFootPassengerTask from '../../__fixtures__/taskData_RoRo_Foot_Passenger_AssigneeCurrentUser.fixture.json';

import refDataAirlineCodes from '../../__fixtures__/taskData_Airpax_AirlineCodes.json';

describe('VoyageSection', () => {
  it('should render the voyage section for an airpax task', () => {
    const tree = renderer.create(
      <VoyageSection targetTask={mockAirpaxTargetTask} refDataAirlineCodes={refDataAirlineCodes} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the voyage section for a RoRo v2 accompanied task', () => {
    const tree = renderer.create(
      <VoyageSection targetTask={mockRoRoTargetTask} refDataAirlineCodes={refDataAirlineCodes} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the voyage section for a RoRo v2 foot passenger task', () => {
    const tree = renderer.create(
      <VoyageSection targetTask={mockRoRoFootPassengerTask} refDataAirlineCodes={refDataAirlineCodes} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
