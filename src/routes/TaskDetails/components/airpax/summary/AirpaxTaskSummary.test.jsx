import React from 'react';
import renderer from 'react-test-renderer';

import AirpaxTaskSummary from './AirpaxTaskSummary';

import refDataAirlineCodes from '../../../../../__fixtures__/taskData_Airpax_AirlineCodes.json';
import mockTargetTask from '../../../../../__fixtures__/taskData_AirPax_AssigneeCurrentUser.fixture.json';

describe('AirpaxTaskSummary', () => {
  it('should render the component without crashing', () => {
    const tree = renderer
      .create(<AirpaxTaskSummary version={mockTargetTask.versions[0]} refDataAirlineCodes={refDataAirlineCodes} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
