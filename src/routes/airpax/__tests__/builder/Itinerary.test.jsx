import React from 'react';
import renderer from 'react-test-renderer';
import config from '../../../../config';
import { LONDON_TIMEZONE } from '../../../../constants';

import Itinerary from '../../TaskDetails/builder/Itinerary';
import taskDetailsData from '../../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';

describe('Itinerary', () => {
  beforeEach(() => {
    config.dayjsConfig.timezone = LONDON_TIMEZONE;
  });
  it('should render the itinerary component', () => {
    const tree = renderer.create(<Itinerary version={taskDetailsData.versions[1]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
