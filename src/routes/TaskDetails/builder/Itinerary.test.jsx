import React from 'react';
import renderer from 'react-test-renderer';

import Itinerary from './Itinerary';
import taskDetailsData from '../../../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';

describe('Itinerary', () => {
  it('should render the itinerary component', () => {
    const tree = renderer.create(<Itinerary version={taskDetailsData.versions[1]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
