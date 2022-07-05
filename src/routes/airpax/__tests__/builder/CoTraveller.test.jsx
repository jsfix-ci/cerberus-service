import React from 'react';
import renderer from 'react-test-renderer';

import CoTraveller from '../../TaskDetails/builder/CoTraveller';
import taskDetailsData from '../../__fixtures__/taskData_AirPax_TaskDetails.fixture.json';

describe('CoTraveller', () => {
  it('should render the co traveller component', () => {
    const tree = renderer.create(<CoTraveller version={taskDetailsData.versions[0]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
