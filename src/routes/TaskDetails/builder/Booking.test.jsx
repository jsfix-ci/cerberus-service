import React from 'react';
import renderer from 'react-test-renderer';

import Booking from './Booking';
import taskDetailsData from '../../../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';

describe('Booking', () => {
  it('should render the booking component', () => {
    const tree = renderer.create(<Booking version={taskDetailsData.versions[1]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
